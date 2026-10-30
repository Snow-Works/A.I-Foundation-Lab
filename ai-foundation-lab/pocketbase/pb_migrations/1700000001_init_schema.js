/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const admins = new Collection({
    id: "ad0000000000001", name: "admins", type: "auth", system: false,
    fields: [
      { id: "adf000000000001", name: "name", type: "text", required: true },
      { id: "adf000000000002", name: "role", type: "select", required: true, options: { values: ["superadmin", "admin", "marker"], maxSelect: 1 } },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: null, updateRule: '@request.auth.collectionName = "admins"', deleteRule: null,
    options: { allowEmailAuth: true, requireEmail: true, minPasswordLength: 8 }
  });
  app.save(admins);

  const profiles = new Collection({
    id: "pr0000000000001", name: "profiles", type: "auth", system: false,
    fields: [
      { id: "prf000000000001", name: "first_name", type: "text", required: true },
      { id: "prf000000000002", name: "middle_name", type: "text" },
      { id: "prf000000000003", name: "surname", type: "text", required: true },
      { id: "prf000000000004", name: "whatsapp", type: "text", required: true },
      { id: "prf000000000005", name: "batch", type: "text" },
      { id: "prf000000000006", name: "status", type: "select", required: true, options: { values: ["REGISTERED", "EMAIL_VERIFIED", "APPROVED", "PHOTO_VERIFIED", "COMMUNITY_UNLOCKED", "IDENTITY_CONFIRMED", "EXAM_IN_PROGRESS", "SUBMITTED", "MARKED", "REJECTED"], maxSelect: 1 } },
      { id: "prf000000000007", name: "approved_by", type: "relation", options: { collectionId: "ad0000000000001", maxSelect: 1 } },
      { id: "prf000000000008", name: "approved_at", type: "date" },
      { id: "prf000000000009", name: "photo", type: "file", options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"], thumbs: ["256x256", "512x512"] } },
      { id: "prf000000000010", name: "photo_verified", type: "bool" },
      { id: "prf000000000011", name: "photo_verified_at", type: "date" },
      { id: "prf000000000012", name: "identity_confirmed_at", type: "date" },
      { id: "prf000000000013", name: "attempts_remaining", type: "number", options: { min: 0, noDecimal: true } },
      { id: "prf000000000014", name: "resets_remaining", type: "number", options: { min: 0, noDecimal: true } },
      { id: "prf000000000015", name: "notes", type: "text" },
    ],
    listRule: 'id = @request.auth.id || @request.auth.collectionName = "admins"', viewRule: 'id = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: "", updateRule: 'id = @request.auth.id || @request.auth.collectionName = "admins"', deleteRule: null,
    options: { allowEmailAuth: true, requireEmail: true, minPasswordLength: 8 }
  });
  app.save(profiles);

  const roster = new Collection({
    id: "ro0000000000001", name: "roster", type: "base", system: false,
    fields: [
      { id: "rof000000000001", name: "first_name", type: "text", required: true },
      { id: "rof000000000002", name: "middle_name", type: "text" },
      { id: "rof000000000003", name: "surname", type: "text", required: true },
      { id: "rof000000000004", name: "batch", type: "text" },
      { id: "rof000000000005", name: "notes", type: "text" },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(roster);

  const app_settings = new Collection({
    id: "as0000000000001", name: "app_settings", type: "base", system: false,
    fields: [
      { id: "asf000000000001", name: "telegram_group_url", type: "text" },
      { id: "asf000000000002", name: "telegram_enabled", type: "bool" },
      { id: "asf000000000003", name: "exam_telegram_group_url", type: "text" },
      { id: "asf000000000004", name: "exam_telegram_enabled", type: "bool" },
      { id: "asf000000000005", name: "require_roster_match", type: "bool" },
      { id: "asf000000000006", name: "registration_open", type: "bool" },
      { id: "asf000000000007", name: "exam_duration_minutes", type: "number", options: { noDecimal: true } },
      { id: "asf000000000008", name: "attempt_limit", type: "number", options: { noDecimal: true } },
      { id: "asf000000000009", name: "announcement", type: "text" },
    ],
    listRule: '@request.auth.collectionName = "admins" || (@request.auth.id != "" && @request.auth.photo_verified = true)',
    viewRule: '@request.auth.collectionName = "admins" || (@request.auth.id != "" && @request.auth.photo_verified = true)',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: null,
    options: {}
  });
  app.save(app_settings);

  const questions = new Collection({
    id: "qu0000000000001", name: "questions", type: "base", system: false,
    fields: [
      { id: "quf000000000001", name: "title", type: "text", required: true },
      { id: "quf000000000002", name: "prompt", type: "text", required: true },
      { id: "quf000000000003", name: "difficulty", type: "select", required: true, options: { values: ["easy", "medium", "hard"], maxSelect: 1 } },
      { id: "quf000000000004", name: "topic", type: "text" },
      { id: "quf000000000005", name: "rubric", type: "text" },
      { id: "quf000000000006", name: "sample_solution", type: "text" },
      { id: "quf000000000007", name: "active", type: "bool" },
      { id: "quf000000000008", name: "created_by", type: "relation", options: { collectionId: "ad0000000000001", maxSelect: 1 } },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(questions);

  const exam_blueprints = new Collection({
    id: "bp0000000000001", name: "exam_blueprints", type: "base", system: false,
    fields: [
      { id: "bpf000000000001", name: "name", type: "text", required: true },
      { id: "bpf000000000002", name: "is_active", type: "bool" },
      { id: "bpf000000000003", name: "easy_count", type: "number", options: { noDecimal: true } },
      { id: "bpf000000000004", name: "medium_count", type: "number", options: { noDecimal: true } },
      { id: "bpf000000000005", name: "hard_count", type: "number", options: { noDecimal: true } },
      { id: "bpf000000000006", name: "notes", type: "text" },
    ],
    listRule: '@request.auth.id != ""', viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(exam_blueprints);

  const attempts = new Collection({
    id: "at0000000000001", name: "attempts", type: "base", system: false,
    fields: [
      { id: "atf000000000001", name: "student", type: "relation", required: true, options: { collectionId: "pr0000000000001", maxSelect: 1 } },
      { id: "atf000000000002", name: "blueprint", type: "relation", options: { collectionId: "bp0000000000001", maxSelect: 1 } },
      { id: "atf000000000003", name: "status", type: "select", required: true, options: { values: ["in_progress", "submitted", "marked", "released", "terminated"], maxSelect: 1 } },
      { id: "atf000000000004", name: "started_at", type: "date", required: true },
      { id: "atf000000000005", name: "submitted_at", type: "date" },
      { id: "atf000000000006", name: "deadline_at", type: "date" },
      { id: "atf000000000007", name: "duration_seconds", type: "number", options: { noDecimal: true } },
      { id: "atf000000000008", name: "violation_count", type: "number", options: { noDecimal: true } },
      { id: "atf000000000009", name: "auto_terminated", type: "bool" },
      { id: "atf000000000010", name: "score_total", type: "number" },
      { id: "atf000000000011", name: "score_max", type: "number" },
      { id: "atf000000000012", name: "admin_notes", type: "text" },
    ],
    listRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"', viewRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(attempts);

  const attempt_questions = new Collection({
    id: "aq0000000000001", name: "attempt_questions", type: "base", system: false,
    fields: [
      { id: "aqf000000000001", name: "attempt", type: "relation", required: true, options: { collectionId: "at0000000000001", maxSelect: 1 } },
      { id: "aqf000000000002", name: "question", type: "relation", required: true, options: { collectionId: "qu0000000000001", maxSelect: 1 } },
      { id: "aqf000000000003", name: "order", type: "number", options: { noDecimal: true } },
      { id: "aqf000000000004", name: "assigned_at", type: "date" },
    ],
    listRule: 'attempt.student = @request.auth.id || @request.auth.collectionName = "admins"', viewRule: 'attempt.student = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(attempt_questions);

  const answers = new Collection({
    id: "an0000000000001", name: "answers", type: "base", system: false,
    fields: [
      { id: "anf000000000001", name: "attempt", type: "relation", required: true, options: { collectionId: "at0000000000001", maxSelect: 1 } },
      { id: "anf000000000002", name: "question", type: "relation", required: true, options: { collectionId: "qu0000000000001", maxSelect: 1 } },
      { id: "anf000000000003", name: "student", type: "relation", required: true, options: { collectionId: "pr0000000000001", maxSelect: 1 } },
      { id: "anf000000000004", name: "body", type: "text" },
      { id: "anf000000000005", name: "is_draft", type: "bool" },
      { id: "anf000000000006", name: "saved_at", type: "date" },
      { id: "anf000000000007", name: "submitted_at", type: "date" },
    ],
    listRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"', viewRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: 'student = @request.auth.id', updateRule: 'student = @request.auth.id', deleteRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(answers);

  const violations = new Collection({
    id: "vi0000000000001", name: "violations", type: "base", system: false,
    fields: [
      { id: "vif000000000001", name: "attempt", type: "relation", required: true, options: { collectionId: "at0000000000001", maxSelect: 1 } },
      { id: "vif000000000002", name: "student", type: "relation", options: { collectionId: "pr0000000000001", maxSelect: 1 } },
      { id: "vif000000000003", name: "type", type: "text", required: true },
      { id: "vif000000000004", name: "occurred_at", type: "date", required: true },
      { id: "vif000000000005", name: "details", type: "json" },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: 'attempt.student = @request.auth.id', updateRule: null, deleteRule: null,
    options: {}
  });
  app.save(violations);

  const marks = new Collection({
    id: "ma0000000000001", name: "marks", type: "base", system: false,
    fields: [
      { id: "maf000000000001", name: "attempt_question", type: "relation", required: true, options: { collectionId: "aq0000000000001", maxSelect: 1 } },
      { id: "maf000000000002", name: "score", type: "number" },
      { id: "maf000000000003", name: "max_score", type: "number" },
      { id: "maf000000000004", name: "comment", type: "text" },
      { id: "maf000000000005", name: "marked_by", type: "relation", options: { collectionId: "ad0000000000001", maxSelect: 1 } },
      { id: "maf000000000006", name: "marked_at", type: "date" },
      { id: "maf000000000007", name: "released", type: "bool" },
    ],
    listRule: 'attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = "released" || @request.auth.collectionName = "admins"',
    viewRule: 'attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = "released" || @request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(marks);

  const gate_tokens = new Collection({
    id: "gt0000000000001", name: "gate_tokens", type: "base", system: false,
    fields: [
      { id: "gtf000000000001", name: "token", type: "text", required: true },
      { id: "gtf000000000002", name: "expires_at", type: "date", required: true },
      { id: "gtf000000000003", name: "used_by", type: "relation", options: { collectionId: "pr0000000000001", maxSelect: 1 } },
      { id: "gtf000000000004", name: "used_at", type: "date" },
      { id: "gtf000000000005", name: "created_by", type: "relation", options: { collectionId: "ad0000000000001", maxSelect: 1 } },
      { id: "gtf000000000006", name: "revoked", type: "bool" },
      { id: "gtf000000000007", name: "max_uses", type: "number", options: { noDecimal: true } },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: '@request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(gate_tokens);

  const audit_log = new Collection({
    id: "al0000000000001", name: "audit_log", type: "base", system: false,
    fields: [
      { id: "alf000000000001", name: "actor", type: "text" },
      { id: "alf000000000002", name: "actor_type", type: "select", options: { values: ["admin", "student", "system"], maxSelect: 1 } },
      { id: "alf000000000003", name: "action", type: "text", required: true },
      { id: "alf000000000004", name: "target_type", type: "text" },
      { id: "alf000000000005", name: "target_id", type: "text" },
      { id: "alf000000000006", name: "details", type: "json" },
      { id: "alf000000000007", name: "occurred_at", type: "date" },
    ],
    listRule: '@request.auth.collectionName = "admins"', viewRule: '@request.auth.collectionName = "admins"',
    createRule: '@request.auth.collectionName = "admins"', updateRule: null, deleteRule: null,
    options: {}
  });
  app.save(audit_log);

  const support_messages = new Collection({
    id: "sm0000000000001", name: "support_messages", type: "base", system: false,
    fields: [
      { id: "smf000000000001", name: "student", type: "relation", required: true, options: { collectionId: "pr0000000000001", maxSelect: 1, cascadeDelete: true } },
      { id: "smf000000000002", name: "sender_id", type: "text" },
      { id: "smf000000000003", name: "sender_type", type: "select", required: true, options: { values: ["student", "admin"], maxSelect: 1 } },
      { id: "smf000000000004", name: "body", type: "text" },
      { id: "smf000000000005", name: "is_read_by_admin", type: "bool" },
      { id: "smf000000000006", name: "is_read_by_student", type: "bool" },
      { id: "smf000000000007", name: "attachment", type: "file", options: { maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/*", "video/*", "audio/*"] } },
      { id: "smf000000000008", name: "message_type", type: "select", required: true, options: { values: ["text", "image", "video", "audio"], maxSelect: 1 } },
    ],
    listRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"', viewRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: '@request.auth.id != ""', updateRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"', deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });
  app.save(support_messages);

}, (app) => {
  const names = ["support_messages", "audit_log", "gate_tokens", "marks", "violations", "answers", "attempt_questions", "attempts", "exam_blueprints", "questions", "app_settings", "roster", "profiles", "admins"];
  for (const name of names) {
    try { app.delete(app.findCollectionByNameOrId(name)); } catch (_) {}
  }
});
