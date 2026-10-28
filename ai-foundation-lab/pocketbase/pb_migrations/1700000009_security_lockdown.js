/// <reference path="../pb_data/types.d.ts" />

/* ============================================================
   SECURITY LOCKDOWN
   ------------------------------------------------------------
   Two collections were overly permissive. This migration
   restores admin-only access and enforces read isolation:

   - questions  : was readable by ANY authenticated user,
                  leaking prompts, rubrics, and sample solutions.
                  Student reads now go through /api/exam/start,
                  /api/exam/resume, and /api/exam/result.

   - gate_tokens: was readable by ANY caller (`id != ""` is
                  always true). Validation now goes through
                  GET /api/gate/validate, claim through
                  POST /api/gate/claim.
   ============================================================ */

migrate((db) => {
    const dao = new Dao(db);

    // ---- questions: admins only ----
    const questions = dao.findCollectionByNameOrId("qu0000000000001");
    questions.listRule = '@request.auth.collectionName = "admins"';
    questions.viewRule = '@request.auth.collectionName = "admins"';
    dao.saveCollection(questions);

    // ---- gate_tokens: admins only ----
    const gateTokens = dao.findCollectionByNameOrId("gt0000000000001");
    gateTokens.listRule = '@request.auth.collectionName = "admins"';
    gateTokens.viewRule = '@request.auth.collectionName = "admins"';
    gateTokens.createRule = '@request.auth.collectionName = "admins"';
    gateTokens.updateRule = '@request.auth.collectionName = "admins"';
    gateTokens.deleteRule = '@request.auth.collectionName = "admins"';
    dao.saveCollection(gateTokens);

    return null;
}, (db) => {
    const dao = new Dao(db);

    // Restore previous (insecure) rules on rollback
    const questions = dao.findCollectionByNameOrId("qu0000000000001");
    questions.listRule = '@request.auth.collectionName = "admins" || @request.auth.id != ""';
    questions.viewRule = '@request.auth.collectionName = "admins" || @request.auth.id != ""';
    dao.saveCollection(questions);

    const gateTokens = dao.findCollectionByNameOrId("gt0000000000001");
    gateTokens.listRule = 'id != ""';
    gateTokens.viewRule = 'id != ""';
    gateTokens.createRule = '@request.auth.collectionName = "admins"';
    gateTokens.updateRule = '@request.auth.collectionName = "admins"';
    gateTokens.deleteRule = '@request.auth.collectionName = "admins"';
    dao.saveCollection(gateTokens);

    return null;
});