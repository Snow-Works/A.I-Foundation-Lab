/// <reference path="../pb_data/types.d.ts" />

/* ============================================================
   PING TEST ROUTE
   ============================================================ */
routerAdd("GET", "/api/ping", (c) => {
  return c.json(200, { message: "pong" });
});

/* ============================================================
   POST /api/exam/start
   ============================================================ */
routerAdd("POST", "/api/exam/start", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    /* ---------- 1. AUTO-EXPIRY SWEEPER ---------- */
    try {
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
      const inProgress = $app.dao().findRecordsByFilter("attempts", "student = {:student} && status = 'in_progress'", "", 0, 0, { student: authRecord.id });
      let swept = 0;
      
      for (const expired of inProgress) {
        const deadlineStr = expired.get("deadline_at");
        if (deadlineStr && deadlineStr < nowStr) {
          expired.set("status", "submitted");
          expired.set("submitted_at", deadlineStr);
          expired.set("auto_terminated", true);
          $app.dao().saveRecord(expired);
          swept++;
        }
      }

      if (swept > 0 && authRecord.get("status") === "EXAM_IN_PROGRESS") {
        authRecord.set("status", "IDENTITY_CONFIRMED");
        $app.dao().saveRecord(authRecord);
      }
    } catch (sweeperErr) {
      console.warn("[exam/start] sweeper failed (continuing):", sweeperErr);
    }

    /* ---------- 2. ELIGIBILITY ---------- */
    if (authRecord.get("status") !== "IDENTITY_CONFIRMED") {
      return c.json(403, {
        message: "You must confirm your identity before starting the exam.",
      });
    }

    let settings = null;
    try {
      const list = $app.dao().findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {});
      settings = list[0] || null;
    } catch (_) {}

    const attemptLimit = settings ? settings.get("attempt_limit") || 2 : 2;

    const priorAttempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status != 'in_progress'",
      "",
      0,
      0,
      { student: authRecord.id }
    );

    if (priorAttempts.length >= attemptLimit) {
      return c.json(403, {
        message: `You've used all ${attemptLimit} of your attempts. Contact an admin.`,
      });
    }

    /* ---------- 3. EXISTING IN-PROGRESS CHECK ---------- */
    const existing = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'in_progress'",
      "",
      1,
      0,
      { student: authRecord.id }
    );

    if (existing.length > 0) {
      return c.json(409, {
        message: "You already have an attempt in progress.",
        data: { attemptId: existing[0].id },
      });
    }

    /* ---------- 4. BLUEPRINT + QUESTION BANK ---------- */
    let blueprint = null;
    try {
      const bps = $app.dao().findRecordsByFilter(
        "exam_blueprints",
        "is_active = true",
        "",
        1,
        0,
        {}
      );
      blueprint = bps[0] || null;
    } catch (_) {}

    const totalQuestions = blueprint
      ? (blueprint.get("easy_count") || 0) +
        (blueprint.get("medium_count") || 0) +
        (blueprint.get("hard_count") || 0)
      : 25;

    const allActive = $app.dao().findRecordsByFilter(
      "questions",
      "active = true",
      "",
      0,
      0,
      {}
    );

    if (allActive.length < totalQuestions) {
      return c.json(400, {
        message: `Not enough questions in the bank. Need ${totalQuestions}, have ${allActive.length}.`,
      });
    }

    /* ---------- 5. FISHER-YATES SHUFFLE ---------- */
    const shuffled = allActive.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    const selected = shuffled.slice(0, totalQuestions);

    const durationMinutes = settings
      ? settings.get("exam_duration_minutes") || 60
      : 60;
    const startedAt = new Date();
    const deadlineAt = new Date(
      startedAt.getTime() + durationMinutes * 60 * 1000
    );

    /* ---------- 6. CREATE ATTEMPT ---------- */
    const attemptsCollection = $app.dao().findCollectionByNameOrId("attempts");
    const attempt = new Record(attemptsCollection);
    attempt.set("student", authRecord.id);
    if (blueprint) attempt.set("blueprint", blueprint.id);
    attempt.set("status", "in_progress");
    attempt.set("started_at", startedAt.toISOString());
    attempt.set("deadline_at", deadlineAt.toISOString());
    attempt.set("duration_seconds", durationMinutes * 60);
    attempt.set("violation_count", 0);
    attempt.set("auto_terminated", false);
    $app.dao().saveRecord(attempt);

    /* ---------- 7. ASSIGN QUESTIONS ---------- */
    const aqCollection = $app
      .dao()
      .findCollectionByNameOrId("attempt_questions");
    const questionsPayload = [];

    for (let i = 0; i < selected.length; i++) {
      const q = selected[i];
      const aq = new Record(aqCollection);
      aq.set("attempt", attempt.id);
      aq.set("question", q.id);
      aq.set("order", i + 1);
      aq.set("assigned_at", startedAt.toISOString());
      $app.dao().saveRecord(aq);

      questionsPayload.push({
        id: q.id,
        title: q.get("title"),
        prompt: q.get("prompt"),
        difficulty: q.get("difficulty"),
        topic: q.get("topic") || "",
        order: i + 1,
      });
    }

    authRecord.set("status", "EXAM_IN_PROGRESS");
    $app.dao().saveRecord(authRecord);

    return c.json(200, {
      attempt: {
        id: attempt.id,
        started_at: attempt.get("started_at"),
        deadline_at: attempt.get("deadline_at"),
        duration_seconds: attempt.get("duration_seconds"),
        status: attempt.get("status"),
      },
      questions: questionsPayload,
      drafts: [],
    });
  } catch (err) {
    console.error("[exam/start] error:", err);
    return c.json(500, {
      message: "Something went wrong starting the exam.",
      details: String(err),
    });
  }
});

/* ============================================================
   GET /api/exam/resume
   ============================================================ */
routerAdd("GET", "/api/exam/resume", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const attempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'in_progress'",
      "",
      1,
      0,
      { student: authRecord.id }
    );

    if (attempts.length === 0) {
      return c.json(404, { message: "No exam in progress." });
    }

    const attempt = attempts[0];

    const aqList = $app.dao().findRecordsByFilter(
      "attempt_questions",
      "attempt = {:attempt}",
      "order",
      0,
      0,
      { attempt: attempt.id }
    );

    const questionsPayload = [];
    const draftsPayload = [];

    for (const aq of aqList) {
      let q;
      try {
        q = $app.dao().findRecordById("questions", aq.get("question"));
      } catch (_) {
        continue;
      }

      questionsPayload.push({
        id: q.id,
        title: q.get("title"),
        prompt: q.get("prompt"),
        difficulty: q.get("difficulty"),
        topic: q.get("topic") || "",
        order: aq.get("order"),
      });

      try {
        const drafts = $app.dao().findRecordsByFilter(
          "answers",
          "attempt = {:attempt} && question = {:question} && is_draft = true",
          "",
          1,
          0,
          { attempt: attempt.id, question: q.id }
        );
        if (drafts.length > 0) {
          draftsPayload.push({
            questionId: q.id,
            answerId: drafts[0].id,
            body: drafts[0].get("body") || "",
          });
        }
      } catch (_) {}
    }

    return c.json(200, {
      attempt: {
        id: attempt.id,
        started_at: attempt.get("started_at"),
        deadline_at: attempt.get("deadline_at"),
        duration_seconds: attempt.get("duration_seconds"),
        status: attempt.get("status"),
      },
      questions: questionsPayload,
      drafts: draftsPayload,
    });
  } catch (err) {
    console.error("[exam/resume] error:", err);
    return c.json(500, {
      message: "Something went wrong resuming the exam.",
      details: String(err),
    });
  }
});

/* ============================================================
   POST /api/exam/violation
   ============================================================ */
routerAdd("POST", "/api/exam/violation", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated." });
    }

    const data = info.data || {};
    const attemptId = data.attempt;
    const type = data.type;
    const details = data.details || {};
    const occurredAt = data.occurred_at || new Date().toISOString();

    if (!attemptId || !type) {
      return c.json(400, { message: "Missing attempt or type." });
    }

    let attempt;
    try {
      attempt = $app.dao().findRecordById("attempts", attemptId);
    } catch (_) {
      return c.json(404, { message: "Attempt not found." });
    }

    if (attempt.get("student") !== authRecord.id) {
      return c.json(403, { message: "Attempt does not belong to you." });
    }

    if (attempt.get("status") !== "in_progress") {
      return c.json(409, { message: "Attempt is no longer in progress." });
    }

    const currentCount = attempt.get("violation_count") || 0;
    const newCount = currentCount + 1;
    attempt.set("violation_count", newCount);

    const shouldTerminate = newCount >= 2 || type === "fullscreen_exit";
    if (shouldTerminate) {
      attempt.set("status", "terminated");
      attempt.set("auto_terminated", true);
    }
    $app.dao().saveRecord(attempt);

    const vCollection = $app.dao().findCollectionByNameOrId("violations");
    const v = new Record(vCollection);
    v.set("attempt", attemptId);
    v.set("student", authRecord.id);
    v.set("type", type);
    v.set("occurred_at", occurredAt);
    v.set("details", details);
    $app.dao().saveRecord(v);

    if (shouldTerminate) {
      authRecord.set("status", "IDENTITY_CONFIRMED");
      $app.dao().saveRecord(authRecord);
    }

    return c.json(200, {
      violation_count: newCount,
      terminated: shouldTerminate,
    });
  } catch (err) {
    console.error("[exam/violation] error:", err);
    return c.json(500, {
      message: "Failed to log violation.",
      details: String(err),
    });
  }
});

/* ============================================================
   POST /api/exam/submit
   ============================================================ */
routerAdd("POST", "/api/exam/submit", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const data = info.data || {};
    const attemptId = data.attempt;
    if (!attemptId) {
      return c.json(400, { message: "Missing attempt id." });
    }

    let attempt;
    try {
      attempt = $app.dao().findRecordById("attempts", attemptId);
    } catch (_) {
      return c.json(404, { message: "Attempt not found." });
    }

    if (attempt.get("student") !== authRecord.id) {
      return c.json(403, { message: "Attempt does not belong to you." });
    }

    const status = attempt.get("status");
    if (status === "submitted" || status === "marked" || status === "released") {
      return c.json(200, {
        attempt_id: attemptId,
        submitted_at: attempt.get("submitted_at"),
        answers_finalized: 0,
        already_submitted: true,
      });
    }

    if (status !== "in_progress") {
      return c.json(409, {
        message: `This attempt cannot be submitted (status: ${status}).`,
      });
    }

    const now = new Date().toISOString();

    const drafts = $app.dao().findRecordsByFilter(
      "answers",
      "attempt = {:attempt} && is_draft = true",
      "",
      0,
      0,
      { attempt: attemptId }
    );

    for (const d of drafts) {
      d.set("is_draft", false);
      d.set("submitted_at", now);
      $app.dao().saveRecord(d);
    }

    attempt.set("status", "submitted");
    attempt.set("submitted_at", now);
    $app.dao().saveRecord(attempt);

    authRecord.set("status", "SUBMITTED");
    $app.dao().saveRecord(authRecord);

    return c.json(200, {
      attempt_id: attemptId,
      submitted_at: now,
      answers_finalized: drafts.length,
    });
  } catch (err) {
    console.error("[exam/submit] error:", err);
    return c.json(500, {
      message: "Failed to submit.",
      details: String(err),
    });
  }
});

/* ============================================================
   POST /api/exam/abandon
   ============================================================ */
routerAdd("POST", "/api/exam/abandon", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;

    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const resets = authRecord.get("resets_remaining");
    const currentResets = resets === null || resets === undefined ? 3 : resets;

    if (currentResets <= 0) {
      return c.json(403, {
        message: "You have no resets remaining. You must resume your active exam.",
      });
    }

    const attempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'in_progress'",
      "",
      1,
      0,
      { student: authRecord.id }
    );

    if (attempts.length > 0) {
      const oldAttempt = attempts[0];
      oldAttempt.set("status", "submitted");
      oldAttempt.set("auto_terminated", true);
      $app.dao().saveRecord(oldAttempt);
    }

    authRecord.set("resets_remaining", currentResets - 1);
    authRecord.set("status", "IDENTITY_CONFIRMED");
    $app.dao().saveRecord(authRecord);

    return c.json(200, {
      success: true,
      resets_remaining: currentResets - 1,
    });
  } catch (err) {
    console.error("[exam/abandon] error:", err);
    return c.json(500, {
      message: "Failed to abandon exam.",
      details: String(err),
    });
  }
});

/* ============================================================
   GET /api/exam/meta
   ============================================================ */
routerAdd("GET", "/api/exam/meta", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    let settings = null;
    try {
      const list = $app.dao().findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {});
      settings = list[0] || null;
    } catch (_) {}

    let blueprint = null;
    try {
      const bps = $app.dao().findRecordsByFilter(
        "exam_blueprints",
        "is_active = true",
        "",
        1,
        0,
        {}
      );
      blueprint = bps[0] || null;
    } catch (_) {}

    const questionCount = blueprint
      ? (blueprint.get("easy_count") || 0) +
        (blueprint.get("medium_count") || 0) +
        (blueprint.get("hard_count") || 0)
      : 25;

    const durationMinutes = settings
      ? settings.get("exam_duration_minutes") || 105
      : 105;

    const attemptLimit = settings ? settings.get("attempt_limit") || 2 : 2;

    return c.json(200, {
      question_count: questionCount,
      duration_minutes: durationMinutes,
      attempt_limit: attemptLimit,
    });
  } catch (err) {
    console.error("[exam/meta] error:", err);
    return c.json(500, {
      message: "Failed to load exam meta.",
      details: String(err),
    });
  }
});

/* ============================================================
   GET /api/exam/result
   ============================================================ */
routerAdd("GET", "/api/exam/result", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const attempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'released'",
      "-updated",
      1,
      0,
      { student: authRecord.id }
    );

    if (attempts.length === 0) {
      return c.json(200, { result: null });
    }

    const attempt = attempts[0];

    const aqList = $app.dao().findRecordsByFilter(
      "attempt_questions",
      "attempt = {:attempt}",
      "order",
      0,
      0,
      { attempt: attempt.id }
    );

    let totalScore = 0;
    let maxScore = 0;
    const questions = [];

    for (const aq of aqList) {
      let q;
      try {
        q = $app.dao().findRecordById("questions", aq.get("question"));
      } catch (_) {
        continue;
      }

      let answerBody = "";
      try {
        const answers = $app.dao().findRecordsByFilter(
          "answers",
          "attempt = {:attempt} && question = {:question}",
          "",
          1,
          0,
          { attempt: attempt.id, question: q.id }
        );
        if (answers.length > 0) answerBody = answers[0].get("body") || "";
      } catch (_) {}

      let mark = null;
      try {
        const marks = $app.dao().findRecordsByFilter(
          "marks",
          "attempt_question = {:aq}",
          "",
          1,
          0,
          { aq: aq.id }
        );
        if (marks.length > 0) {
          const m = marks[0];
          const score = Number(m.get("score")) || 0;
          const max = Number(m.get("max_score")) || 10;
          mark = {
            score,
            max_score: max,
            comment: m.get("comment") || "",
          };
          totalScore += score;
          maxScore += max;
        }
      } catch (_) {}

      questions.push({
        attempt_question_id: aq.id,
        order: aq.get("order"),
        question: {
          id: q.id,
          title: q.get("title"),
          prompt: q.get("prompt"),
          difficulty: q.get("difficulty"),
          topic: q.get("topic") || "",
        },
        answer: answerBody,
        mark,
      });
    }

    return c.json(200, {
      result: {
        attempt: {
          id: attempt.id,
          status: attempt.get("status"),
          submitted_at: attempt.get("submitted_at"),
          updated: attempt.get("updated"),
        },
        student: {
          id: authRecord.id,
          email: authRecord.get("email"),
          first_name: authRecord.get("first_name"),
          middle_name: authRecord.get("middle_name") || "",
          surname: authRecord.get("surname"),
        },
        questions,
        totalScore,
        maxScore,
        passed: totalScore >= 180,
      },
    });
  } catch (err) {
    console.error("[exam/result] error:", err);
    return c.json(500, {
      message: "Failed to load result.",
      details: String(err),
    });
  }
});

/* ============================================================
   GET /api/gate/validate?id=xxx
   ============================================================ */
routerAdd("GET", "/api/gate/validate", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    const id = c.queryParam("id");

    if (!id) {
      return c.json(400, { message: "Missing id." });
    }

    let record;
    try {
      record = $app.dao().findRecordById("gate_tokens", id);
    } catch (_) {
      return c.json(200, { valid: false, reason: "not_found" });
    }

    if (record.get("revoked")) {
      return c.json(200, { valid: false, reason: "revoked" });
    }

    if (new Date(record.get("expires_at")) < new Date()) {
      return c.json(200, { valid: false, reason: "expired" });
    }

    const usedBy = record.get("used_by");
    const maxUses = record.get("max_uses") || 1;

    if (usedBy) {
      if (authRecord && authRecord.collection().name === "profiles" && usedBy === authRecord.id) {
        return c.json(200, { valid: true, already_claimed: true });
      }
      if (maxUses === 1) {
        return c.json(200, { valid: false, reason: "already_used" });
      }
    }

    return c.json(200, { valid: true });
  } catch (err) {
    console.error("[gate/validate] error:", err);
    return c.json(500, { message: "Validation failed.", details: String(err) });
  }
});

/* ============================================================
   POST /api/gate/claim
   ============================================================ */
routerAdd("POST", "/api/gate/claim", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const data = info.data || {};
    const recordId = data.recordId;
    if (!recordId) {
      return c.json(400, { message: "Missing recordId." });
    }

    let record;
    try {
      record = $app.dao().findRecordById("gate_tokens", recordId);
    } catch (_) {
      return c.json(200, { valid: false, reason: "not_found" });
    }

    if (record.get("revoked")) {
      return c.json(200, { valid: false, reason: "revoked" });
    }

    if (new Date(record.get("expires_at")) < new Date()) {
      return c.json(200, { valid: false, reason: "expired" });
    }

    const usedBy = record.get("used_by");
    const maxUses = record.get("max_uses") || 1;

    if (usedBy && usedBy !== authRecord.id && maxUses === 1) {
      return c.json(200, { valid: false, reason: "already_used" });
    }

    if (!usedBy) {
      record.set("used_by", authRecord.id);
      record.set("used_at", new Date().toISOString());
      $app.dao().saveRecord(record);
    }

    authRecord.set("status", "IDENTITY_CONFIRMED");
    authRecord.set("identity_confirmed_at", new Date().toISOString());
    $app.dao().saveRecord(authRecord);

    return c.json(200, {
      valid: true,
      user: {
        id: authRecord.id,
        email: authRecord.get("email"),
        first_name: authRecord.get("first_name"),
        surname: authRecord.get("surname"),
        status: authRecord.get("status"),
      },
    });
  } catch (err) {
    console.error("[gate/claim] error:", err);
    return c.json(500, { message: "Claim failed.", details: String(err) });
  }
});

/* ============================================================
   POST /api/admin/roster/upload
   ============================================================ */
routerAdd("POST", "/api/admin/roster/upload", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "admins") {
      return c.json(401, { message: "Not authenticated as an admin." });
    }

    const data = info.data || {};
    const entries = data.entries;
    if (!Array.isArray(entries) || entries.length === 0) {
      return c.json(400, { message: "No entries provided." });
    }

    const rosterCollection = $app.dao().findCollectionByNameOrId("roster");

    let existingKeys = new Set();
    try {
      const existing = $app.dao().findRecordsByFilter(
        "roster",
        "id != ''",
        "",
        10000,
        0,
        {}
      );
      existing.forEach((r) => {
        const fname = String(r.get("first_name") || "").trim().toLowerCase();
        const sname = String(r.get("surname") || "").trim().toLowerCase();
        existingKeys.add(`${fname}|${sname}`);
      });
    } catch (err) {
      console.warn("[roster/upload] Could not load existing records:", err);
    }

    let created = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] || {};
      const firstName = String(entry.first_name || "").trim();
      const middleName = String(entry.middle_name || "").trim();
      const surname = String(entry.surname || "").trim();
      const batch = String(entry.batch || "").trim();
      const notes = String(entry.notes || "").trim();

      if (!firstName || !surname) {
        skipped++;
        errors.push({ row: i + 1, reason: "Missing first_name or surname" });
        continue;
      }

      const key = `${firstName.toLowerCase()}|${surname.toLowerCase()}`;
      if (existingKeys.has(key)) {
        skipped++;
        continue;
      }

      try {
        const r = new Record(rosterCollection);
        r.set("first_name", firstName);
        r.set("middle_name", middleName);
        r.set("surname", surname);
        r.set("batch", batch);
        r.set("notes", notes);
        $app.dao().saveRecord(r);
        existingKeys.add(key);
        created++;
      } catch (err) {
        skipped++;
        errors.push({ row: i + 1, reason: String(err) });
      }
    }

    return c.json(200, { created, skipped, errors });
  } catch (err) {
    console.error("[roster/upload] error:", err);
    return c.json(500, { message: "Upload failed.", details: String(err) });
  }
});

/* ============================================================
   POST /api/admin/users/delete
   ============================================================ */
routerAdd("POST", "/api/admin/users/delete", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const adminRecord = info.authRecord;
    if (!adminRecord || adminRecord.collection().name !== "admins") {
      return c.json(401, { message: "Not authenticated as an admin." });
    }

    const data = info.data || {};
    const userId = data.userId;
    if (!userId) {
      return c.json(400, { message: "Missing userId." });
    }

    if (userId === adminRecord.id) {
      return c.json(400, { message: "You cannot delete your own admin account." });
    }

    let userRecord;
    try {
      userRecord = $app.dao().findRecordById("profiles", userId);
    } catch (_) {
      return c.json(404, { message: "User not found." });
    }

    try {
      const marks = $app.dao().findRecordsByFilter(
        "marks",
        "attempt_question.attempt.student = {:userId}",
        "", 0, 0, { userId }
      );
      for (const m of marks) $app.dao().deleteRecord(m);

      const answers = $app.dao().findRecordsByFilter(
        "answers",
        "student = {:userId}",
        "", 0, 0, { userId }
      );
      for (const a of answers) $app.dao().deleteRecord(a);

      const aqs = $app.dao().findRecordsByFilter(
        "attempt_questions",
        "attempt.student = {:userId}",
        "", 0, 0, { userId }
      );
      for (const aq of aqs) $app.dao().deleteRecord(aq);

      const violations = $app.dao().findRecordsByFilter(
        "violations",
        "student = {:userId}",
        "", 0, 0, { userId }
      );
      for (const v of violations) $app.dao().deleteRecord(v);

      const attempts = $app.dao().findRecordsByFilter(
        "attempts",
        "student = {:userId}",
        "", 0, 0, { userId }
      );
      for (const at of attempts) $app.dao().deleteRecord(at);

      const tokens = $app.dao().findRecordsByFilter(
        "gate_tokens",
        "used_by = {:userId}",
        "", 0, 0, { userId }
      );
      for (const t of tokens) {
        t.set("used_by", "");
        $app.dao().saveRecord(t);
      }

      const userEmail = userRecord.get("email");
      const userName = userRecord.get("first_name") + " " + userRecord.get("surname");

      $app.dao().deleteRecord(userRecord);

      try {
        const auditCollection = $app.dao().findCollectionByNameOrId("audit_log");
        const log = new Record(auditCollection);
        log.set("actor", adminRecord.get("name") || adminRecord.get("email"));
        log.set("actor_type", "admin");
        log.set("action", "deleted_user");
        log.set("target_type", "profile");
        log.set("target_id", userId);
        log.set("details", { email: userEmail, name: userName });
        log.set("occurred_at", new Date().toISOString());
        $app.dao().saveRecord(log);
      } catch (auditErr) {
        console.error("[admin/delete-user] audit log failed:", auditErr);
      }

      return c.json(200, { success: true });
    } catch (err) {
      console.error("[admin/delete-user] error:", err);
      return c.json(500, { message: "Failed to delete user.", details: String(err) });
    }
  } catch (err) {
    console.error("[admin/delete-user] outer error:", err);
    return c.json(500, { message: "Internal error.", details: String(err) });
  }
});

/* ============================================================
   GET /api/admin/status
   ============================================================ */
routerAdd("GET", "/api/admin/status", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const adminRecord = info.authRecord;
    if (!adminRecord || adminRecord.collection().name !== "admins") {
      return c.json(401, { message: "Not authenticated as an admin." });
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    const totalStudents = $app.dao().findRecordsByFilter("profiles", "id != ''", "", 0, 0, {}).length;
    const totalAttempts = $app.dao().findRecordsByFilter("attempts", "id != ''", "", 0, 0, {}).length;
    
    const pendingMarking = $app.dao().findRecordsByFilter(
      "attempts", "status = 'submitted'", "", 0, 0, {}
    ).length;

    const inProgress = $app.dao().findRecordsByFilter("attempts", "status = 'in_progress'", "", 0, 0, {});
    
    let activeCount = 0;
    let stalledCount = 0;

    for (const attempt of inProgress) {
      const deadlineStr = attempt.get("deadline_at");
      if (deadlineStr && deadlineStr < now) {
        stalledCount++;
      } else {
        activeCount++;
      }
    }

    return c.json(200, {
      totalStudents,
      totalAttempts,
      activeExams: activeCount,
      stalledExams: stalledCount,
      pendingMarking,
      serverTime: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[admin/status] error:", err);
    return c.json(500, { message: "Failed to load status.", details: String(err) });
  }
});

/* ============================================================
   POST /api/admin/sweep
   ============================================================ */
routerAdd("POST", "/api/admin/sweep", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const adminRecord = info.authRecord;
    if (!adminRecord || adminRecord.collection().name !== "admins") {
      return c.json(401, { message: "Not authenticated as an admin." });
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const inProgress = $app.dao().findRecordsByFilter("attempts", "status = 'in_progress'", "", 0, 0, {});
    
    let swept = 0;
    for (const expired of inProgress) {
      const deadlineStr = expired.get("deadline_at");
      if (deadlineStr && deadlineStr < now) {
        expired.set("status", "submitted");
        expired.set("submitted_at", deadlineStr);
        expired.set("auto_terminated", true);
        $app.dao().saveRecord(expired);

        try {
          const profile = $app.dao().findRecordById("profiles", expired.get("student"));
          if (profile.get("status") === "EXAM_IN_PROGRESS") {
            profile.set("status", "SUBMITTED");
            $app.dao().saveRecord(profile);
          }
        } catch (_) {}

        swept++;
      }
    }

    return c.json(200, { success: true, swept });
  } catch (err) {
    console.error("[admin/sweep] error:", err);
    return c.json(500, { message: "Failed to sweep.", details: String(err) });
  }
});

/* ============================================================
   GET /api/admin/analytics
   ============================================================ */
routerAdd("GET", "/api/admin/analytics", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const adminRecord = info.authRecord;
    if (!adminRecord || adminRecord.collection().name !== "admins") {
      return c.json(401, { message: "Not authenticated as an admin." });
    }

    // 1. Signups Data (Last 30 Days)
    const signupsMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().substring(0, 10); // YYYY-MM-DD
      signupsMap[dateStr] = 0;
    }

    const allProfiles = $app.dao().findRecordsByFilter("profiles", "id != ''", "", 0, 0, {});
    allProfiles.forEach(p => {
      try {
        const d = new Date(p.get("created"));
        if (isNaN(d.getTime())) return;
        const createdStr = d.toISOString().substring(0, 10);
        if (signupsMap[createdStr] !== undefined) {
          signupsMap[createdStr]++;
        }
      } catch (e) {
        // ignore invalid dates
      }
    });

    const signupsData = Object.keys(signupsMap).map(date => {
      const parts = date.split("-");
      const displayDate = `${parts[1]}/${parts[2]}`; // MM/DD
      return { date: displayDate, count: signupsMap[date] };
    });

    // 2. Pass/Fail Data
    const releasedAttempts = $app.dao().findRecordsByFilter("attempts", "status = 'released'", "", 0, 0, {});
    const releasedAttemptIds = {};
    releasedAttempts.forEach(a => releasedAttemptIds[a.id] = true);

    let passCount = 0;
    let failCount = 0;
    const PASS_MARK = 180;

    if (releasedAttempts.length > 0) {
      const allAqs = $app.dao().findRecordsByFilter("attempt_questions", "id != ''", "", 0, 0, {});
      const aqsForReleased = allAqs.filter(aq => releasedAttemptIds[aq.get("attempt")]);
      
      const aqIds = {};
      aqsForReleased.forEach(aq => aqIds[aq.id] = true);

      const allMarks = $app.dao().findRecordsByFilter("marks", "id != ''", "", 0, 0, {});
      const marksForReleased = allMarks.filter(m => aqIds[m.get("attempt_question")]);

      const scores = {};
      for (const m of marksForReleased) {
        const aqId = m.get("attempt_question");
        scores[aqId] = (scores[aqId] || 0) + (Number(m.get("score")) || 0);
      }

      for (const a of releasedAttempts) {
        let total = 0;
        for (const aq of aqsForReleased) {
          if (aq.get("attempt") === a.id) {
            total += scores[aq.id] || 0;
          }
        }
        if (total >= PASS_MARK) passCount++;
        else failCount++;
      }
    }

    const passFailData = [
      { name: "Passed", value: passCount },
      { name: "Failed", value: failCount }
    ];

    // 3. Violations Data
    const allViolations = $app.dao().findRecordsByFilter("violations", "id != ''", "", 0, 0, {});
    const violationsMap = {};
    allViolations.forEach(v => {
      const type = v.get("type");
      violationsMap[type] = (violationsMap[type] || 0) + 1;
    });

    const violationsData = Object.keys(violationsMap).map(type => {
      let displayType = type.replace(/_/g, " ");
      displayType = displayType.charAt(0).toUpperCase() + displayType.slice(1);
      return { name: displayType, count: violationsMap[type] };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    return c.json(200, {
      signups: signupsData,
      passFail: passFailData,
      violations: violationsData
    });
  } catch (err) {
    console.error("[admin/analytics] error:", err);
    return c.json(500, { message: "Failed to load analytics.", details: String(err) });
  }
});

/* ============================================================
   GET /api/leaderboard
   ============================================================ */
routerAdd("GET", "/api/leaderboard", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    const batchFilter = c.queryParam("batch");

    // Fetch all released attempts
    const releasedAttempts = $app.dao().findRecordsByFilter("attempts", "status = 'released'", "", 0, 0, {});
    if (releasedAttempts.length === 0) {
      return c.json(200, { leaderboard: [], batches: [] });
    }

    const releasedAttemptIds = {};
    releasedAttempts.forEach(a => releasedAttemptIds[a.id] = true);

    // Fetch associated profiles
    const studentIds = {};
    releasedAttempts.forEach(a => studentIds[a.get("student")] = true);
    
    const allProfiles = $app.dao().findRecordsByFilter("profiles", "id != ''", "", 0, 0, {});
    const profileMap = {};
    allProfiles.forEach(p => {
      if (studentIds[p.id]) {
        profileMap[p.id] = {
          id: p.id,
          first_name: p.get("first_name"),
          surname: p.get("surname"),
          batch: p.get("batch") || "Unassigned"
        };
      }
    });

    // Fetch all AQs and Marks to calculate scores
    const allAqs = $app.dao().findRecordsByFilter("attempt_questions", "id != ''", "", 0, 0, {});
    const aqsByAttempt = {};
    allAqs.forEach(aq => {
      if (releasedAttemptIds[aq.get("attempt")]) {
        if (!aqsByAttempt[aq.get("attempt")]) aqsByAttempt[aq.get("attempt")] = [];
        aqsByAttempt[aq.get("attempt")].push(aq.id);
      }
    });

    const allMarks = $app.dao().findRecordsByFilter("marks", "id != ''", "", 0, 0, {});
    const markMap = {};
    allMarks.forEach(m => {
      markMap[m.get("attempt_question")] = {
        score: Number(m.get("score")) || 0,
        max_score: Number(m.get("max_score")) || 10
      };
    });

    // Calculate highest score per student
    const bestAttempts = {};
    const availableBatchesSet = {};

    for (const a of releasedAttempts) {
      const studentId = a.get("student");
      const student = profileMap[studentId];
      if (!student) continue;

      let totalScore = 0;
      let maxScore = 0;
      const aqIds = aqsByAttempt[a.id] || [];
      
      for (const aqId of aqIds) {
        const mark = markMap[aqId];
        if (mark) {
          totalScore += mark.score;
          maxScore += mark.max_score;
        }
      }

      const passed = totalScore >= 180;

      const attemptData = {
        studentId,
        first_name: student.first_name,
        surname: student.surname,
        batch: student.batch,
        totalScore,
        maxScore,
        passed
      };

      // Keep only the highest score for each student
      if (!bestAttempts[studentId] || totalScore > bestAttempts[studentId].totalScore) {
        bestAttempts[studentId] = attemptData;
      }
      
      // Track available batches for the dropdown filter
      availableBatchesSet[student.batch] = true;
    }

    let list = Object.values(bestAttempts);

    // Apply batch filter if provided
    if (batchFilter) {
      list = list.filter(item => item.batch === batchFilter);
    }

    // Sort by score descending, then name alphabetically for ties
    list.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.surname.localeCompare(b.surname);
    });

    // Assign ranks (Top 20 only)
    const leaderboard = list.slice(0, 20).map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    const batches = Object.keys(availableBatchesSet).sort();

    return c.json(200, { leaderboard, batches });
  } catch (err) {
    console.error("[leaderboard] error:", err);
    return c.json(500, { message: "Failed to load leaderboard.", details: String(err) });
  }
});

/* ============================================================
   Roster enforcement on profile creation.
   + Auto-assign batch from roster.
   ============================================================ */
onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== "profiles") return;

  try {
    if (e.httpContext.admin()) return;
  } catch (_) {}

  try {
    const auth = e.httpContext.get("authRecord");
    if (auth && auth.collection().name === "admins") return;
  } catch (_) {}

  let requireMatch = false;
  try {
    const settings = $app.dao().findRecordsByFilter("app_settings", "id != ''", "", 1, 0, {});
    if (settings.length > 0) {
      requireMatch = settings[0].get("require_roster_match") === true;
    }
  } catch (err) {
    console.warn("[roster] settings read failed, allowing registration:", err);
    return;
  }

  const firstName = String(e.record.get("first_name") || "").trim();
  const surname = String(e.record.get("surname") || "").trim();
  if (!firstName || !surname) return;

  try {
    const candidates = $app.dao().findRecordsByFilter(
      "roster",
      "first_name ~ {:f} && surname ~ {:s}",
      "",
      20,
      0,
      { f: firstName, s: surname }
    );
    const exact = candidates.filter(
      (r) =>
        String(r.get("first_name") || "").trim().toLowerCase() ===
          firstName.toLowerCase() &&
        String(r.get("surname") || "").trim().toLowerCase() ===
          surname.toLowerCase()
    );
    
    if (exact.length > 0) {
      // Auto-inject the batch from the roster if it exists
      const rosterBatch = exact[0].get("batch");
      if (rosterBatch && !e.record.get("batch")) {
        e.record.set("batch", rosterBatch);
      }
    } else if (requireMatch) {
      throw new BadRequestError(
        "Your name is not on the approved roster. Contact the admin to be added."
      );
    }
  } catch (err) {
    if (err instanceof BadRequestError) throw err;
    console.warn("[roster] lookup failed, allowing registration:", err);
  }
});






/* ============================================================
   SUPPORT MESSAGES HOOKS
   ============================================================ */
onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== "support_messages") return;

  const auth = e.httpContext.get("authRecord");
  if (!auth) return;

  if (auth.collection().name === "profiles") {
    e.record.set("student", auth.id);
    e.record.set("sender_id", auth.id);
    e.record.set("sender_type", "student");
    e.record.set("is_read_by_admin", false);
    e.record.set("is_read_by_student", true);
  } else if (auth.collection().name === "admins") {
    e.record.set("sender_id", auth.id);
    e.record.set("sender_type", "admin");
    e.record.set("is_read_by_admin", true);
    e.record.set("is_read_by_student", false);
  }
});

onRecordBeforeUpdateRequest((e) => {
  if (e.collection.name !== "support_messages") return;

  const auth = e.httpContext.get("authRecord");
  if (!auth) return;

  if (auth.collection().name === "profiles") {
    const original = e.record.original();
    if (original) {
      e.record.set("body", original.get("body") || "");
      e.record.set("sender_id", original.get("sender_id") || "");
      e.record.set("sender_type", original.get("sender_type") || "student");
      e.record.set("student", original.get("student") || "");
      e.record.set("is_read_by_admin", original.get("is_read_by_admin") || false);
      e.record.set("attachment", original.get("attachment") || "");
      e.record.set("message_type", original.get("message_type") || "text");
    }
  }
});