/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // ---------- helpers ----------
  const text = (id, name, required = false, opts = {}) => ({
    id, name, type: "text", system: false, required, unique: false,
    options: { min: null, max: null, pattern: "", ...opts },
  });
  const longtext = (id, name, required = false) => ({
    id, name, type: "text", system: false, required, unique: false,
    options: { min: null, max: null, pattern: "" },
  });
  const number = (id, name, required = false, opts = {}) => ({
    id, name, type: "number", system: false, required, unique: false,
    options: { min: null, max: null, noDecimal: false, ...opts },
  });
  const bool = (id, name) => ({
    id, name, type: "bool", system: false, required: false, unique: false,
    options: {},
  });
  const date = (id, name, required = false) => ({
    id, name, type: "date", system: false, required, unique: false,
    options: { min: "", max: "" },
  });
  const select = (id, name, values, required = false, opts = {}) => ({
    id, name, type: "select", system: false, required, unique: false,
    options: { maxSelect: 1, values, ...opts },
  });
  const json = (id, name) => ({
    id, name, type: "json", system: false, required: false, unique: false,
    options: { maxSize: 0 },
  });
  const relation = (id, name, collId, opts = {}) => ({
    id, name, type: "relation", system: false, required: false, unique: false,
    options: {
      collectionId: collId,
      cascadeDelete: false,
      minSelect: null,
      maxSelect: 1,
      displayFields: null,
      ...opts,
    },
  });

  // ---------- collection IDs (15 chars each) ----------
  const ID = {
    admins:          "ad0000000000001",
    profiles:        "pr0000000000001",
    roster:          "ro0000000000001",
    app_settings:    "as0000000000001",
    questions:       "qu0000000000001",
    exam_blueprints: "bp0000000000001",
    attempts:        "at0000000000001",
    attempt_questions: "aq0000000000001",
    answers:         "an0000000000001",
    violations:      "vi0000000000001",
    marks:           "ma0000000000001",
    gate_tokens:     "gt0000000000001",
    audit_log:       "al0000000000001",
  };

  // ============================================================
  // 1. ADMINS (auth)
  // ============================================================
  const admins = new Collection({
    id: ID.admins,
    name: "admins",
    type: "auth",
    system: false,
    schema: [
      text("adf000000000001", "name", true, { max: 120 }),
      select("adf000000000002", "role", ["superadmin", "admin", "marker"], true),
    ],
    indexes: [],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: null,
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: null,
    options: {
      allowEmailAuth: true,
      allowOAuth2Auth: false,
      allowUsernameAuth: false,
      requireEmail: true,
      minPasswordLength: 8,
    },
  });
  dao.saveCollection(admins);

  // ============================================================
  // 2. PROFILES (auth — student accounts)
  // ============================================================
  const STATUSES = [
    "REGISTERED", "EMAIL_VERIFIED", "APPROVED", "PHOTO_VERIFIED",
    "COMMUNITY_UNLOCKED", "IDENTITY_CONFIRMED",
    "EXAM_IN_PROGRESS", "SUBMITTED", "MARKED", "REJECTED",
  ];

  const profiles = new Collection({
    id: ID.profiles,
    name: "profiles",
    type: "auth",
    system: false,
    schema: [
      text("prf000000000001", "first_name", true, { max: 60 }),
      text("prf000000000002", "middle_name", false, { max: 60 }),
      text("prf000000000003", "surname", true, { max: 60 }),
      text("prf000000000004", "whatsapp", true, { max: 20 }),
      select("prf000000000005", "status", STATUSES, true, { maxSelect: 1 }),
      relation("prf000000000006", "approved_by", ID.admins),
      date("prf000000000007", "approved_at"),
      bool("prf000000000008", "photo_verified"),
      date("prf000000000009", "photo_verified_at"),
      date("prf000000000010", "identity_confirmed_at"),
      number("prf000000000011", "attempts_remaining", false, { min: 0, noDecimal: true }),
      longtext("prf000000000012", "notes"),
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_profiles_email ON profiles (email)",
      "CREATE INDEX idx_profiles_status ON profiles (status)",
    ],
    listRule: "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    viewRule: "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    createRule: "",
    updateRule: "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    deleteRule: null,
    options: {
      allowEmailAuth: true,
      allowOAuth2Auth: false,
      allowUsernameAuth: false,
      requireEmail: true,
      minPasswordLength: 8,
    },
  });
  dao.saveCollection(profiles);

  // ============================================================
  // 3. ROSTER (base — admin only)
  // ============================================================
  const roster = new Collection({
    id: ID.roster,
    name: "roster",
    type: "base",
    system: false,
    schema: [
      text("rof000000000001", "first_name", true, { max: 60 }),
      text("rof000000000002", "middle_name", false, { max: 60 }),
      text("rof000000000003", "surname", true, { max: 60 }),
      text("rof000000000004", "email", false, { max: 160 }),
      text("rof000000000005", "batch", false, { max: 60 }),
      longtext("rof000000000006", "notes"),
    ],
    indexes: [
      "CREATE INDEX idx_roster_name ON roster (first_name, surname)",
    ],
    listRule: null, viewRule: null,
    createRule: null, updateRule: null, deleteRule: null,
    options: {},
  });
  dao.saveCollection(roster);

  // ============================================================
  // 4. APP_SETTINGS (base — singleton, public read)
  // ============================================================
  const app_settings = new Collection({
    id: ID.app_settings,
    name: "app_settings",
    type: "base",
    system: false,
    schema: [
      text("asf000000000001", "telegram_group_url", false, { max: 500 }),
      bool("asf000000000002", "telegram_enabled"),
      bool("asf000000000003", "require_roster_match"),
      bool("asf000000000004", "registration_open"),
      number("asf000000000005", "exam_duration_minutes", false, { noDecimal: true }),
      number("asf000000000006", "attempt_limit", false, { noDecimal: true }),
      longtext("asf000000000007", "announcement"),
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: null,
    options: {},
  });
  dao.saveCollection(app_settings);

  // ============================================================
  // 5. QUESTIONS (base — admin only)
  // ============================================================
  const questions = new Collection({
    id: ID.questions,
    name: "questions",
    type: "base",
    system: false,
    schema: [
      text("quf000000000001", "title", true, { max: 200 }),
      longtext("quf000000000002", "prompt", true),
      select("quf000000000003", "difficulty", ["easy", "medium", "hard"], true),
      text("quf000000000004", "topic", false, { max: 80 }),
      longtext("quf000000000005", "rubric"),
      longtext("quf000000000006", "sample_solution"),
      bool("quf000000000007", "active"),
      relation("quf000000000008", "created_by", ID.admins),
    ],
    indexes: [
      "CREATE INDEX idx_questions_difficulty ON questions (difficulty)",
      "CREATE INDEX idx_questions_active ON questions (active)",
    ],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(questions);

  // ============================================================
  // 6. EXAM_BLUEPRINTS (base — admin only)
  // ============================================================
  const exam_blueprints = new Collection({
    id: ID.exam_blueprints,
    name: "exam_blueprints",
    type: "base",
    system: false,
    schema: [
      text("bpf000000000001", "name", true, { max: 120 }),
      bool("bpf000000000002", "is_active"),
      number("bpf000000000003", "easy_count", false, { noDecimal: true }),
      number("bpf000000000004", "medium_count", false, { noDecimal: true }),
      number("bpf000000000005", "hard_count", false, { noDecimal: true }),
      longtext("bpf000000000006", "notes"),
    ],
    indexes: [],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(exam_blueprints);

  // ============================================================
  // 7. ATTEMPTS (base)
  // ============================================================
  const attempts = new Collection({
    id: ID.attempts,
    name: "attempts",
    type: "base",
    system: false,
    schema: [
      relation("atf000000000001", "student", ID.profiles, { required: true }),
      relation("atf000000000002", "blueprint", ID.exam_blueprints),
      select("atf000000000003", "status",
        ["in_progress", "submitted", "marked", "released", "terminated"], true),
      date("atf000000000004", "started_at", true),
      date("atf000000000005", "submitted_at"),
      date("atf000000000006", "deadline_at"),
      number("atf000000000007", "duration_seconds", false, { noDecimal: true }),
      number("atf000000000008", "violation_count", false, { noDecimal: true }),
      bool("atf000000000009", "auto_terminated"),
      number("atf000000000010", "score_total"),
      number("atf000000000011", "score_max"),
      longtext("atf000000000012", "admin_notes"),
    ],
    indexes: [
      "CREATE INDEX idx_attempts_student ON attempts (student)",
      "CREATE INDEX idx_attempts_status ON attempts (status)",
    ],
    listRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    viewRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(attempts);

  // ============================================================
  // 8. ATTEMPT_QUESTIONS (base)
  // ============================================================
  const attempt_questions = new Collection({
    id: ID.attempt_questions,
    name: "attempt_questions",
    type: "base",
    system: false,
    schema: [
      relation("aqf000000000001", "attempt", ID.attempts, { required: true }),
      relation("aqf000000000002", "question", ID.questions, { required: true }),
      number("aqf000000000003", "order", false, { noDecimal: true }),
      date("aqf000000000004", "assigned_at"),
    ],
    indexes: [
      "CREATE INDEX idx_attempt_questions_attempt ON attempt_questions (attempt)",
    ],
    listRule: "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    viewRule: "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(attempt_questions);

  // ============================================================
  // 9. ANSWERS (base)
  // ============================================================
  const answers = new Collection({
    id: ID.answers,
    name: "answers",
    type: "base",
    system: false,
    schema: [
      relation("anf000000000001", "attempt", ID.attempts, { required: true }),
      relation("anf000000000002", "question", ID.questions, { required: true }),
      relation("anf000000000003", "student", ID.profiles, { required: true }),
      longtext("anf000000000004", "body"),
      bool("anf000000000005", "is_draft"),
      date("anf000000000006", "saved_at"),
      date("anf000000000007", "submitted_at"),
    ],
    indexes: [
      "CREATE INDEX idx_answers_attempt ON answers (attempt)",
      "CREATE INDEX idx_answers_student ON answers (student)",
    ],
    listRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    viewRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    createRule: "student = @request.auth.id",
    updateRule: "student = @request.auth.id",
    deleteRule: "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(answers);

  // ============================================================
  // 10. VIOLATIONS (base)
  // ============================================================
  const violations = new Collection({
    id: ID.violations,
    name: "violations",
    type: "base",
    system: false,
    schema: [
      relation("vif000000000001", "attempt", ID.attempts, { required: true }),
      relation("vif000000000002", "student", ID.profiles),
      text("vif000000000003", "type", true, { max: 60 }),
      date("vif000000000004", "occurred_at", true),
      json("vif000000000005", "details"),
    ],
    indexes: [
      "CREATE INDEX idx_violations_attempt ON violations (attempt)",
    ],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "attempt.student = @request.auth.id",
    updateRule: null,
    deleteRule: null,
    options: {},
  });
  dao.saveCollection(violations);

  // ============================================================
  // 11. MARKS (base — admin only)
  // ============================================================
  const marks = new Collection({
    id: ID.marks,
    name: "marks",
    type: "base",
    system: false,
    schema: [
      relation("maf000000000001", "attempt_question", ID.attempt_questions, { required: true }),
      number("maf000000000002", "score"),
      number("maf000000000003", "max_score"),
      longtext("maf000000000004", "comment"),
      relation("maf000000000005", "marked_by", ID.admins),
      date("maf000000000006", "marked_at"),
      bool("maf000000000007", "released"),
    ],
    indexes: [
      "CREATE INDEX idx_marks_attempt_question ON marks (attempt_question)",
    ],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(marks);

  // ============================================================
  // 12. GATE_TOKENS (base — admin only)
  // ============================================================
  const gate_tokens = new Collection({
    id: ID.gate_tokens,
    name: "gate_tokens",
    type: "base",
    system: false,
    schema: [
      text("gtf000000000001", "token", true, { max: 100 }),
      date("gtf000000000002", "expires_at", true),
      relation("gtf000000000003", "used_by", ID.profiles),
      date("gtf000000000004", "used_at"),
      relation("gtf000000000005", "created_by", ID.admins),
      bool("gtf000000000006", "revoked"),
      number("gtf000000000007", "max_uses", false, { noDecimal: true }),
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_gate_tokens_token ON gate_tokens (token)",
    ],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: "@request.auth.collectionName = \"admins\"",
    deleteRule: "@request.auth.collectionName = \"admins\"",
    options: {},
  });
  dao.saveCollection(gate_tokens);

  // ============================================================
  // 13. AUDIT_LOG (base — admin only)
  // ============================================================
  const audit_log = new Collection({
    id: ID.audit_log,
    name: "audit_log",
    type: "base",
    system: false,
    schema: [
      text("alf000000000001", "actor", false, { max: 60 }),
      select("alf000000000002", "actor_type", ["admin", "student", "system"]),
      text("alf000000000003", "action", true, { max: 80 }),
      text("alf000000000004", "target_type", false, { max: 40 }),
      text("alf000000000005", "target_id", false, { max: 60 }),
      json("alf000000000006", "details"),
      date("alf000000000007", "occurred_at"),
    ],
    indexes: [
      "CREATE INDEX idx_audit_action ON audit_log (action)",
      "CREATE INDEX idx_audit_occurred ON audit_log (occurred_at)",
    ],
    listRule: "@request.auth.collectionName = \"admins\"",
    viewRule: "@request.auth.collectionName = \"admins\"",
    createRule: "@request.auth.collectionName = \"admins\"",
    updateRule: null,
    deleteRule: null,
    options: {},
  });
  dao.saveCollection(audit_log);

  return null;
}, (db) => {
  const dao = new Dao(db);
  const names = [
    "audit_log", "gate_tokens", "marks", "violations", "answers",
    "attempt_questions", "attempts", "exam_blueprints", "questions",
    "app_settings", "roster", "profiles", "admins",
  ];
  for (const name of names) {
    try {
      const c = dao.findCollectionByNameOrId(name);
      dao.deleteCollection(c);
    } catch (_) {}
  }
  return null;
});