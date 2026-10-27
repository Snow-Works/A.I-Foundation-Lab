/// <reference path="../pb_data/types.d.ts" />

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

    if (authRecord.get("status") !== "IDENTITY_CONFIRMED") {
      return c.json(403, {
        message: "You must confirm your identity before starting the exam.",
      });
    }

    let settings = null;
    try {
      const list = $app.dao().findRecordsByFilter("app_settings", "", "", 1, 0);
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
        data: { attemptId: existing[0].id }, // <-- Wrapped in data
      });
    }

    let blueprint = null;
    try {
      const bps = $app.dao().findRecordsByFilter(
        "exam_blueprints",
        "is_active = true",
        "",
        1,
        0
      );
      blueprint = bps[0] || null;
    } catch (_) {}

    const totalQuestions = blueprint
      ? (blueprint.get("easy_count") || 0) +
        (blueprint.get("medium_count") || 0) +
        (blueprint.get("hard_count") || 0)
      : 15;

    const allActive = $app.dao().findRecordsByFilter(
      "questions",
      "active = true",
      "",
      0,
      0
    );

    if (allActive.length < totalQuestions) {
      return c.json(400, {
        message: `Not enough questions in the bank. Need ${totalQuestions}, have ${allActive.length}.`,
      });
    }

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
   ------------------------------------------------------------
   Returns the current in-progress attempt for the authenticated
   user, along with the assigned questions and any saved drafts.
   Used when the student refreshes the page or returns later.
   ============================================================ */
routerAdd("GET", "/api/exam/resume", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    // 1. Find in-progress attempt
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

    // 2. Load attempt_questions
    const aqList = $app.dao().findRecordsByFilter(
      "attempt_questions",
      "attempt = {:attempt}",
      "order",
      0,
      0,
      { attempt: attempt.id }
    );

    // 3. Load questions and drafts
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

      // Look for a saved draft for this question
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
   ------------------------------------------------------------
   Logs a violation against the student's in-progress attempt.
   Increments the attempt's violation_count.
   Auto-terminates on:
     - 2nd violation of any kind
     - any fullscreen_exit event (bypasses the two-strike rule)
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
   ------------------------------------------------------------
   Finalizes the student's in-progress attempt:
     - marks all drafts as submitted
     - sets attempts.status = 'submitted'
     - sets profiles.status = 'SUBMITTED'
   Idempotent: safe to call twice.
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
      // Idempotent — already submitted. Return success.
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

    // Finalize all drafts
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

    // Update attempt
    attempt.set("status", "submitted");
    attempt.set("submitted_at", now);
    $app.dao().saveRecord(attempt);

    // Update profile
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

    // Get all existing records safely
    let existingKeys = new Set();
    try {


          // --- AUTO-EXPIRY SWEEPER (Step 9.3) ---
    // Find any in_progress attempts whose deadline has already passed
    const expiredAttempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'in_progress' && deadline_at < {:now}",
      "",
      0,
      0,
      { student: authRecord.id, now: new Date().toISOString() }
    );

    // Mark them as submitted so they don't block the student
    for (const expired of expiredAttempts) {
      expired.set("status", "submitted");
      expired.set("submitted_at", expired.get("deadline_at")); // Use the deadline as the submission time
      $app.dao().saveRecord(expired);
    }
    // -------------------------------------

      const existing = $app.dao().findRecordsByFilter("roster", "id != ''", "", 10000, 0);
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
   Roster enforcement on profile creation.
   Only runs when app_settings.require_roster_match = true.
   Fails open (allows) on any error, so registration never
   breaks because of this hook.
   ============================================================ */
onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== "profiles") return;

  // Skip for superuser admin requests
  try {
    if (e.httpContext.admin()) return;
  } catch (_) {}

  // Skip for custom admin requests
  try {
    const auth = e.httpContext.get("authRecord");
    if (auth && auth.collection().name === "admins") return;
  } catch (_) {}

  // Check the flag — default to false (do not enforce)
  let requireMatch = false;
  try {
    const settings = $app.dao().findRecordsByFilter("app_settings", "", "", 1, 0);
    if (settings.length > 0) {
      requireMatch = settings[0].get("require_roster_match") === true;
    }
  } catch (err) {
    console.warn("[roster] settings read failed, allowing registration:", err);
    return;
  }

  if (!requireMatch) return;

  const firstName = String(e.record.get("first_name") || "").trim();
  const surname = String(e.record.get("surname") || "").trim();
  if (!firstName || !surname) return; // let field validation handle

  try {
    // Substring search first (fast), then confirm exact match in JS
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
    if (exact.length === 0) {
      throw new BadRequestError(
        "Your name is not on the approved roster. Contact the admin to be added."
      );
    }
  } catch (err) {
    if (err instanceof BadRequestError) throw err;
    // Any other error — allow registration (fail open)
    console.warn("[roster] lookup failed, allowing registration:", err);
  }
});




/* 
   POST /api/exam/abandon
   Allows a student to discard their active attempt and start
   fresh. Strictly limited to 3 times per user. */
routerAdd("POST", "/api/exam/abandon", (c) => {
  try {
    const info = $apis.requestInfo(c);
    const authRecord = info.authRecord;
    
    if (!authRecord || authRecord.collection().name !== "profiles") {
      return c.json(401, { message: "Not authenticated as a student." });
    }

    // 1. Check if they have resets remaining
    const resets = authRecord.get("resets_remaining");
    // If null/undefined, we treat it as 3 (default for existing users)
    const currentResets = (resets === null || resets === undefined) ? 3 : resets;

    if (currentResets <= 0) {
      return c.json(403, { message: "You have no resets remaining. You must resume your active exam." });
    }

    // 2. Find their active attempt
    const attempts = $app.dao().findRecordsByFilter(
      "attempts",
      "student = {:student} && status = 'in_progress'",
      "",
      1,
      0,
      { student: authRecord.id }
    );

    if (attempts.length > 0) {
      // 3. Mark the old attempt as abandoned
      const oldAttempt = attempts[0];
      oldAttempt.set("status", "submitted"); 
      oldAttempt.set("auto_terminated", true);
      $app.dao().saveRecord(oldAttempt);
    }

    // 4. Decrement the resets_remaining counter
    authRecord.set("resets_remaining", currentResets - 1);
    
    // 5. Reset their profile status so they are allowed to start a new exam
    authRecord.set("status", "IDENTITY_CONFIRMED");
    $app.dao().saveRecord(authRecord);

    return c.json(200, { success: true, resets_remaining: currentResets - 1 });
  } catch (err) {
    console.error("[exam/abandon] error:", err);
    return c.json(500, { message: "Failed to abandon exam.", details: String(err) });
  }
});