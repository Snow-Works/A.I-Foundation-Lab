// src/services/examService.js
import pb from "../lib/pocketbase";

const GATE_COLLECTION = "gate_tokens";
const PROFILES_COLLECTION = "profiles";

/* ------------------------------------------------------------
   GATE TOKEN
   ------------------------------------------------------------ */

export async function getGateToken(recordId) {
  return pb.collection(GATE_COLLECTION).getOne(recordId);
}

export function validateGateToken(record) {
  if (!record) return { valid: false, reason: "not_found" };
  if (record.revoked) return { valid: false, reason: "revoked" };

  const now = new Date();
  const expires = new Date(record.expires_at);
  if (expires < now) return { valid: false, reason: "expired" };

  if (record.used_by && record.max_uses === 1) {
    return { valid: false, reason: "already_used" };
  }

  return { valid: true };
}

export async function confirmIdentityAndClaimToken({
  recordId,
  email,
  password,
}) {
  const auth = await pb
    .collection(PROFILES_COLLECTION)
    .authWithPassword(email, password);

  const user = pb.authStore.model || auth?.record || auth?.model;
  if (!user) throw new Error("Authentication did not return a user.");

  await pb.collection(GATE_COLLECTION).update(recordId, {
    used_by: user.id,
    used_at: new Date().toISOString(),
  });

  const updated = await pb.collection(PROFILES_COLLECTION).update(user.id, {
    status: "IDENTITY_CONFIRMED",
    identity_confirmed_at: new Date().toISOString(),
  });

  if (pb.authStore.model?.id === user.id) {
    pb.authStore.save(pb.authStore.token, updated);
  }

  return { user: updated };
}

/* ------------------------------------------------------------
   EXAM SESSION
   ------------------------------------------------------------ */

/**
 * Start a new exam attempt.
 * Calls the server-side hook that:
 *   - validates eligibility
 *   - picks random questions
 *   - creates the attempt
 *   - returns { attempt, questions, drafts }
 *
 * Throws ClientResponseError on failure.
 *   - err.status === 409 → already have an attempt in progress
 *   - err.status === 403 → not eligible
 *   - err.status === 400 → not enough questions
 */
export async function startExam() {
  const res = await pb.send("/api/exam/start", { method: "POST" });
  return res;
}

/**
 * Resume the current in-progress attempt.
 * Returns { attempt, questions, drafts }.
 * Throws ClientResponseError(404) if no attempt is in progress.
 */
export async function resumeExam() {
  const res = await pb.send("/api/exam/resume", { method: "GET" });
  return res;
}


/**
 * Submit the given attempt. Finalizes all drafts server-side.
 * Returns { attempt_id, submitted_at, answers_finalized, already_submitted? }.
 */
export async function submitExam(attemptId) {
  const res = await pb.send("/api/exam/submit", {
    method: "POST",
    body: { attempt: attemptId },
  });
  return res;
}