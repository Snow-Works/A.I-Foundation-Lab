/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/ping", (c) => c.json(200, { message: "pong" }));

routerAdd("POST", "/api/exam/start", (c) => {
  try {
    const app = c.app;
    const authRecord = $apis.requestInfo(c).authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") return c.json(401, { message: "Unauthorized" });

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

    if (authRecord.get("status") !== "IDENTITY_CONFIRMED") return c.json(403, { message: "Confirm identity first." });

    let settings = null;
    try { const list = app.findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {}); settings = list[0] || null; } catch (_) {}

    const attemptLimit = settings ? settings.get("attempt_limit") || 2 : 2;
    const priorAttempts = app.findRecordsByFilter("attempts", "student = {:student} && status != 'in_progress'", "", 0, 0, { student: authRecord.id });
    if (priorAttempts.length >= attemptLimit) return c.json(403, { message: `Out of attempts.` });

    const existing = app.findRecordsByFilter("attempts", "student = {:student} && status = 'in_progress'", "", 1, 0, { student: authRecord.id });
    if (existing.length > 0) return c.json(409, { message: "Already in progress.", data: { attemptId: existing[0].id } });

    let blueprint = null;
    try { const bps = app.findRecordsByFilter("exam_blueprints", "is_active = true", "", 1, 0, {}); blueprint = bps[0] || null; } catch (_) {}

    const totalQuestions = blueprint ? (blueprint.get("easy_count") || 0) + (blueprint.get("medium_count") || 0) + (blueprint.get("hard_count") || 0) : 25;
    const allActive = app.findRecordsByFilter("questions", "active = true", "", 0, 0, {});
    if (allActive.length < totalQuestions) return c.json(400, { message: "Not enough questions." });

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
    return c.json(200, { attempt: { id: attempt.id, started_at: attempt.get("started_at"), deadline_at: attempt.get("deadline_at"), duration_seconds: attempt.get("duration_seconds"), status: attempt.get("status") }, questions: questionsPayload, drafts: [] });
  } catch (err) { return c.json(500, { message: "Error", details: String(err) }); }
});

routerAdd("POST", "/api/exam/violation", (c) => {
  try {
    const app = c.app; const authRecord = $apis.requestInfo(c).authRecord; const data = $apis.requestInfo(c).data;
    const attempt = app.findRecordById("attempts", data.attempt);
    const newCount = (attempt.get("violation_count") || 0) + 1; attempt.set("violation_count", newCount);
    const shouldTerminate = newCount >= 2 || data.type === "fullscreen_exit";
    if (shouldTerminate) { attempt.set("status", "terminated"); attempt.set("auto_terminated", true); }
    app.save(attempt);
    const v = new Record(app.findCollectionByNameOrId("violations"));
    v.set("attempt", data.attempt); v.set("student", authRecord.id); v.set("type", data.type); v.set("occurred_at", data.occurred_at || new Date().toISOString()); v.set("details", data.details || {}); app.save(v);
    if (shouldTerminate) { authRecord.set("status", "IDENTITY_CONFIRMED"); app.save(authRecord); }
    return c.json(200, { violation_count: newCount, terminated: shouldTerminate });
  } catch (err) { return c.json(500, { message: "Error", details: String(err) }); }
});

routerAdd("POST", "/api/exam/submit", (c) => {
  try {
    const app = c.app; const authRecord = $apis.requestInfo(c).authRecord; const data = $apis.requestInfo(c).data;
    const attempt = app.findRecordById("attempts", data.attempt); const now = new Date().toISOString();
    const drafts = app.findRecordsByFilter("answers", "attempt = {:attempt} && is_draft = true", "", 0, 0, { attempt: data.attempt });
    for (const d of drafts) { d.set("is_draft", false); d.set("submitted_at", now); app.save(d); }
    attempt.set("status", "submitted"); attempt.set("submitted_at", now); app.save(attempt);
    authRecord.set("status", "SUBMITTED"); app.save(authRecord);
    return c.json(200, { success: true });
  } catch (err) { return c.json(500, { message: "Error", details: String(err) }); }
});

onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== "profiles") return;
  try { if (e.httpContext.admin()) return; const auth = e.httpContext.get("authRecord"); if (auth && auth.collection().name === "admins") return; } catch (_) {}
  let requireMatch = false;
  try { const settings = e.app.findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {}); if (settings.length > 0) requireMatch = settings[0].get("require_roster_match") === true; } catch (err) { return; }
  if (!requireMatch) return;
  const firstName = String(e.record.get("first_name") || "").trim(); const surname = String(e.record.get("surname") || "").trim();
  if (!firstName || !surname) return;
  try {
    const candidates = e.app.findRecordsByFilter("roster", "first_name ~ {:f} && surname ~ {:s}", "", 20, 0, { f: firstName, s: surname });
    const exact = candidates.filter((r) => String(r.get("first_name") || "").trim().toLowerCase() === firstName.toLowerCase() && String(r.get("surname") || "").trim().toLowerCase() === surname.toLowerCase());
    if (exact.length === 0) throw new BadRequestError("Your name is not on the approved roster.");
    else { const rosterBatch = exact[0].get("batch"); if (rosterBatch && !e.record.get("batch")) e.record.set("batch", rosterBatch); }
  } catch (err) { if (err instanceof BadRequestError) throw err; }
});
