/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/ping", (e) => e.json(200, { message: "pong" }));

routerAdd("POST", "/api/exam/start", (e) => {
  try {
    const app = e.app;
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });

    try {
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
      const inProgress = app.findRecordsByFilter("attempts", "student = {:student} && status = 'in_progress'", "", 0, 0, { student: authRecord.id });
      let swept = 0;
      for (const expired of inProgress) {
        const deadlineStr = expired.get("deadline_at");
        if (deadlineStr && deadlineStr < nowStr) {
          expired.set("status", "submitted"); expired.set("submitted_at", deadlineStr); expired.set("auto_terminated", true); app.save(expired); swept++;
        }
      }
      if (swept > 0 && authRecord.get("status") === "EXAM_IN_PROGRESS") { authRecord.set("status", "IDENTITY_CONFIRMED"); app.save(authRecord); }
    } catch (err) {}

    if (authRecord.get("status") !== "IDENTITY_CONFIRMED") return e.json(403, { message: "Confirm identity first." });

    let settings = null;
    try { const list = app.findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {}); settings = list[0] || null; } catch (_) {}

    const attemptLimit = settings ? settings.get("attempt_limit") || 2 : 2;
    const priorAttempts = app.findRecordsByFilter("attempts", "student = {:student} && status != 'in_progress'", "", 0, 0, { student: authRecord.id });
    if (priorAttempts.length >= attemptLimit) return e.json(403, { message: "Out of attempts." });

    const existing = app.findRecordsByFilter("attempts", "student = {:student} && status = 'in_progress'", "", 1, 0, { student: authRecord.id });
    if (existing.length > 0) return e.json(409, { message: "Already in progress.", data: { attemptId: existing[0].id } });

    let blueprint = null;
    try { const bps = app.findRecordsByFilter("exam_blueprints", "is_active = true", "", 1, 0, {}); blueprint = bps[0] || null; } catch (_) {}

    const totalQuestions = blueprint ? (blueprint.get("easy_count") || 0) + (blueprint.get("medium_count") || 0) + (blueprint.get("hard_count") || 0) : 25;
    const allActive = app.findRecordsByFilter("questions", "active = true", "", 0, 0, {});
    if (allActive.length < totalQuestions) return e.json(400, { message: "Not enough questions." });

    const shuffled = allActive.slice();
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const selected = shuffled.slice(0, totalQuestions);

    const durationMinutes = settings ? settings.get("exam_duration_minutes") || 60 : 60;
    const startedAt = new Date();
    const deadlineAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const attempt = new Record(app.findCollectionByNameOrId("attempts"));
    attempt.set("student", authRecord.id); if (blueprint) attempt.set("blueprint", blueprint.id);
    attempt.set("status", "in_progress"); attempt.set("started_at", startedAt.toISOString()); attempt.set("deadline_at", deadlineAt.toISOString());
    attempt.set("duration_seconds", durationMinutes * 60); attempt.set("violation_count", 0); attempt.set("auto_terminated", false);
    app.save(attempt);

    const questionsPayload = [];
    for (let i = 0; i < selected.length; i++) {
      const q = selected[i]; const aq = new Record(app.findCollectionByNameOrId("attempt_questions"));
      aq.set("attempt", attempt.id); aq.set("question", q.id); aq.set("order", i + 1); aq.set("assigned_at", startedAt.toISOString()); app.save(aq);
      questionsPayload.push({ id: q.id, title: q.get("title"), prompt: q.get("prompt"), difficulty: q.get("difficulty"), topic: q.get("topic") || "", order: i + 1 });
    }

    authRecord.set("status", "EXAM_IN_PROGRESS"); app.save(authRecord);
    return e.json(200, { attempt: { id: attempt.id, started_at: attempt.get("started_at"), deadline_at: attempt.get("deadline_at"), duration_seconds: attempt.get("duration_seconds"), status: attempt.get("status") }, questions: questionsPayload, drafts: [] });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});

routerAdd("POST", "/api/exam/violation", (e) => {
  try {
    const app = e.app;
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });
    const data = e.requestInfo().body;

    const attempt = app.findRecordById("attempts", data.attempt);
    if (attempt.get("student") !== authRecord.id) return e.json(403, { message: "Forbidden" });

    const newCount = (attempt.get("violation_count") || 0) + 1; attempt.set("violation_count", newCount);
    const shouldTerminate = newCount >= 2 || data.type === "fullscreen_exit";
    if (shouldTerminate) { attempt.set("status", "terminated"); attempt.set("auto_terminated", true); }
    app.save(attempt);

    const v = new Record(app.findCollectionByNameOrId("violations"));
    v.set("attempt", data.attempt); v.set("student", authRecord.id); v.set("type", data.type); v.set("occurred_at", data.occurred_at || new Date().toISOString()); v.set("details", data.details || {}); app.save(v);
    if (shouldTerminate) { authRecord.set("status", "IDENTITY_CONFIRMED"); app.save(authRecord); }
    return e.json(200, { violation_count: newCount, terminated: shouldTerminate });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});

routerAdd("POST", "/api/exam/submit", (e) => {
  try {
    const app = e.app;
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });
    const data = e.requestInfo().body;

    const attempt = app.findRecordById("attempts", data.attempt);
    if (attempt.get("student") !== authRecord.id) return e.json(403, { message: "Forbidden" });

    const now = new Date().toISOString();
    const drafts = app.findRecordsByFilter("answers", "attempt = {:attempt} && is_draft = true", "", 0, 0, { attempt: data.attempt });
    for (const d of drafts) { d.set("is_draft", false); d.set("submitted_at", now); app.save(d); }
    attempt.set("status", "submitted"); attempt.set("submitted_at", now); app.save(attempt);
    authRecord.set("status", "SUBMITTED"); app.save(authRecord);
    return e.json(200, { success: true });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});

// v0.23+: onRecordCreateRequest; code before e.next() runs "before" the save
onRecordCreateRequest((e) => {
  if (e.collection.name !== "profiles") return e.next();
  if (e.hasSuperuserAuth()) return e.next();
  if (e.auth && e.auth.collection().name === "admins") return e.next();

  let requireMatch = false;
  try {
    const settings = e.app.findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {});
    if (settings.length > 0) requireMatch = settings[0].get("require_roster_match") === true;
  } catch (err) {}

  const firstName = String(e.record.get("first_name") || "").trim();
  const surname = String(e.record.get("surname") || "").trim();
  if (!firstName || !surname) return e.next();

  let match = null;
  let lookupFailed = false;
  try {
    const candidates = e.app.findRecordsByFilter(
      "roster",
      "first_name ~ {:f} && surname ~ {:s}",
      "", 20, 0,
      { f: firstName, s: surname }
    );
    const exact = candidates.filter((r) =>
      String(r.get("first_name") || "").trim().toLowerCase() === firstName.toLowerCase() &&
      String(r.get("surname") || "").trim().toLowerCase() === surname.toLowerCase()
    );
    match = exact[0] || null;
  } catch (err) {
    lookupFailed = true;
  }

  if (match) {
    const rosterBatch = match.get("batch");
    if (rosterBatch && !e.record.get("batch")) e.record.set("batch", rosterBatch);
  } else if (requireMatch && !lookupFailed) {
    throw new BadRequestError("Your name is not on the approved roster.");
  }

  return e.next();
});




// ==========================================
// ADMIN DASHBOARD ANALYTICS (SAFER VERSION)
// ==========================================
routerAdd("GET", "/api/admin/analytics", (c) => {
  try {
    const app = c.app;
    const authRecord = $apis.requestInfo(c).authRecord;
    if (!authRecord || authRecord.collection().name !== "admins") return c.json(403, { message: "Forbidden" });

    let passed = 0, failed = 0;
    try {
      const released = app.findRecordsByFilter("attempts", 'status = "released"', "", 0, 0, {});
      for (const a of released) {
        if ((a.get("score_total") || 0) >= 180) passed++;
        else failed++;
      }
    } catch (e) { console.log("Analytics: attempts failed", e); }

    let topViolations = [];
    try {
      const viols = app.findRecordsByFilter("violations", "id != ''", "", 0, 0, {});
      const vCounts = {};
      for (const v of viols) {
        const type = v.get("type") || "unknown";
        vCounts[type] = (vCounts[type] || 0) + 1;
      }
      topViolations = Object.keys(vCounts).map(k => ({ name: k, count: vCounts[k] })).sort((a,b) => b.count - a.count).slice(0, 5);
    } catch (e) { console.log("Analytics: violations failed", e); }

    let signups = [{ date: "Total", count: 0 }];
    try {
      const count = app.countRecords("profiles");
      signups = [{ date: "Total Users", count: count }];
    } catch (e) { console.log("Analytics: profiles failed", e); }

    return c.json(200, {
      passFail: [ { name: "Passed", value: passed }, { name: "Failed", value: failed } ],
      violations: topViolations.length > 0 ? topViolations : [{ name: "None", count: 0 }],
      signups: signups
    });
  } catch (err) {
    // Fail gracefully with 200 OK so the frontend doesn't crash
    return c.json(200, {
      passFail: [ { name: "Passed", value: 0 }, { name: "Failed", value: 0 } ],
      violations: [{ name: "None", count: 0 }],
      signups: [{ date: "Total", count: 0 }]
    });
  }
});

routerAdd("GET", "/api/admin/status", (c) => {
  try {
    const app = c.app;
    const authRecord = $apis.requestInfo(c).authRecord;
    if (!authRecord || authRecord.collection().name !== "admins") return c.json(403, { message: "Forbidden" });

    const totalStudents = app.countRecords("profiles");
    const totalAttempts = app.countRecords("attempts");
    const activeExams = app.findRecordsByFilter("attempts", 'status = "in_progress"', "", 0, 0, {}).length;
    const now = new Date().toISOString();
    const stalledExams = app.findRecordsByFilter("attempts", `status = "in_progress" && deadline_at < "${now}"`, "", 0, 0, {}).length;

    return c.json(200, { totalStudents, totalAttempts, activeExams, stalledExams });
  } catch (err) {
    return c.json(200, { totalStudents: 0, totalAttempts: 0, activeExams: 0, stalledExams: 0 });
  }
});






// ==========================================
// EXAM GATE: claim a link (student must be logged in)
// ==========================================
routerAdd("POST", "/api/gate/claim", (e) => {
  const authRecord = e.auth;
  if (!authRecord || authRecord.collection().name !== "profiles") {
    return e.json(401, { message: "Unauthorized" });
  }

  const body = e.requestInfo().body || {};
  const id = body.recordId;
  if (!id) return e.json(200, { valid: false, reason: "not_found" });

  let rec;
  try {
    rec = e.app.findRecordById("gate_tokens", id);
  } catch (err) {
    return e.json(200, { valid: false, reason: "not_found" });
  }

  if (rec.get("revoked") === true) {
    return e.json(200, { valid: false, reason: "revoked" });
  }

  const usedBy = rec.get("used_by");
  if (usedBy && String(usedBy).length > 0) {
    return e.json(200, { valid: false, reason: "already_used" });
  }

  const expiresMs = new Date(String(rec.get("expires_at") || "").replace(" ", "T")).getTime();
  if (!isNaN(expiresMs) && expiresMs < Date.now()) {
    return e.json(200, { valid: false, reason: "expired" });
  }




    // Eligibility: photo uploaded + joined the groups
  const GROUP_FIELD = "joined_groups"; // <-- change to your real field name

  const hasPhoto = !!authRecord.get("photo") && authRecord.get("photo_verified") === true;
  if (!hasPhoto) {
    return e.json(403, { message: "Upload your profile photo before taking the exam." });
  }

  if (authRecord.get(GROUP_FIELD) !== true) {
    return e.json(403, { message: "Join the community groups before taking the exam." });
  }






  // Burn the link
  rec.set("used_by", authRecord.id);
  rec.set("used_at", new Date().toISOString());
  e.app.save(rec);

  // Unlock /api/exam/start (it requires IDENTITY_CONFIRMED)
  if (authRecord.get("status") !== "EXAM_IN_PROGRESS") {
    authRecord.set("status", "IDENTITY_CONFIRMED");
    e.app.save(authRecord);
  }

  return e.json(200, { valid: true });
});








// ==========================================
// EXAM: meta (intro page details)
// ==========================================
routerAdd("GET", "/api/exam/meta", (e) => {
  const app = e.app;
  let settings = null;
  try { settings = app.findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {})[0] || null; } catch (_) {}
  let blueprint = null;
  try { blueprint = app.findRecordsByFilter("exam_blueprints", "is_active = true", "", 1, 0, {})[0] || null; } catch (_) {}

  const questionCount = blueprint
    ? (blueprint.get("easy_count") || 0) + (blueprint.get("medium_count") || 0) + (blueprint.get("hard_count") || 0)
    : 25;

  return e.json(200, {
    question_count: questionCount,
    duration_minutes: settings ? settings.get("exam_duration_minutes") || 60 : 60,
    attempt_limit: settings ? settings.get("attempt_limit") || 2 : 2,
  });
});

// ==========================================
// EXAM: resume an in-progress attempt
// ==========================================
routerAdd("GET", "/api/exam/resume", (e) => {
  try {
    const app = e.app;
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });

    const list = app.findRecordsByFilter("attempts", "student = {:s} && status = 'in_progress'", "-created", 1, 0, { s: authRecord.id });
    if (list.length === 0) return e.json(404, { message: "No active exam session." });
    const attempt = list[0];

    const deadlineMs = new Date(String(attempt.get("deadline_at") || "").replace(" ", "T")).getTime();
    if (!isNaN(deadlineMs) && deadlineMs < Date.now()) {
      return e.json(410, { message: "Your exam time has ended. Go back to the exam intro to continue." });
    }

    const aqs = app.findRecordsByFilter("attempt_questions", "attempt = {:a}", "order", 0, 0, { a: attempt.id });
    const questions = [];
    for (const aq of aqs) {
      const q = app.findRecordById("questions", aq.get("question"));
      questions.push({
        id: q.id, title: q.get("title"), prompt: q.get("prompt"),
        difficulty: q.get("difficulty"), topic: q.get("topic") || "", order: aq.get("order"),
      });
    }

    const drafts = app.findRecordsByFilter("answers", "attempt = {:a} && is_draft = true", "", 0, 0, { a: attempt.id })
      .map((d) => ({ questionId: d.get("question"), body: d.get("body") || "", answerId: d.id }));

    return e.json(200, {
      attempt: {
        id: attempt.id, started_at: attempt.get("started_at"), deadline_at: attempt.get("deadline_at"),
        duration_seconds: attempt.get("duration_seconds"), status: attempt.get("status"),
      },
      questions, drafts,
    });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});

// ==========================================
// EXAM: abandon the current attempt (uses a reset)
// ==========================================
routerAdd("POST", "/api/exam/abandon", (e) => {
  try {
    const app = e.app;
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });

    const resets = authRecord.get("resets_remaining");
    const left = resets === null || resets === undefined || resets === "" ? 3 : Number(resets);
    if (left <= 0) return e.json(403, { message: "No resets remaining." });

    const list = app.findRecordsByFilter("attempts", "student = {:s} && status = 'in_progress'", "", 0, 0, { s: authRecord.id });
    for (const attempt of list) {
      for (const a of app.findRecordsByFilter("answers", "attempt = {:a}", "", 0, 0, { a: attempt.id })) app.delete(a);
      for (const aq of app.findRecordsByFilter("attempt_questions", "attempt = {:a}", "", 0, 0, { a: attempt.id })) app.delete(aq);
      app.delete(attempt);
    }

    authRecord.set("resets_remaining", left - 1);
    authRecord.set("status", "IDENTITY_CONFIRMED");
    app.save(authRecord);

    return e.json(200, { success: true, resets_remaining: left - 1 });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});

// ==========================================
// EXAM: latest released result (summary)
// ==========================================
routerAdd("GET", "/api/exam/result", (e) => {
  try {
    const authRecord = e.auth;
    if (!authRecord || authRecord.collection().name !== "profiles") return e.json(401, { message: "Unauthorized" });

    const list = e.app.findRecordsByFilter("attempts", "student = {:s} && status = 'released'", "-created", 1, 0, { s: authRecord.id });
    if (list.length === 0) return e.json(200, { result: null });

    const a = list[0];
    const total = a.get("score_total") || 0;
    return e.json(200, {
      result: {
        attemptId: a.id,
        score_total: total,
        score_max: a.get("score_max") || 0,
        passed: total >= 180,
        submitted_at: a.get("submitted_at"),
      },
    });
  } catch (err) { return e.json(500, { message: "Error", details: String(err) }); }
});