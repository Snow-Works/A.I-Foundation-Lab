// src/services/examService.js
import pb from "../lib/pocketbase";

const PROFILES_COLLECTION = "profiles";

/* ------------------------------------------------------------
   GATE TOKEN — server-validated, never read directly
   ------------------------------------------------------------ */

/**
 * Validate a gate token by id. Public route.
 * Returns { valid: true } | { valid: false, reason: "..." }
 * Reasons: not_found | revoked | expired | already_used
 */
export async function validateGateTokenById(recordId) {
  return pb.send(`/api/gate/validate?id=${encodeURIComponent(recordId)}`, {
    method: "GET",
  });
}

/**
 * Claim a gate token for the currently authenticated student.
 * Must be called AFTER authWithPassword.
 */
export async function claimGateToken(recordId) {
  return pb.send("/api/gate/claim", {
    method: "POST",
    body: { recordId },
  });
}

/**
 * Authenticate the student, claim the gate token, and transition
 * their profile to IDENTITY_CONFIRMED. All in one call.
 *
 * Throws an Error with a user-friendly message if the token is
 * not usable.
 */
export async function confirmIdentityAndClaimToken({
  recordId,
  email,
  password,
}) {
  // 1. Authenticate with PocketBase's native endpoint
  await pb.collection(PROFILES_COLLECTION).authWithPassword(email, password);

  // 2. Claim the gate token (server verifies used_by, revoked, expiry)
  const result = await claimGateToken(recordId);

  if (!result.valid) {
    const reasonMessages = {
      not_found: "This exam link doesn't exist.",
      revoked: "This exam link has been cancelled.",
      expired: "This exam link has expired.",
      already_used: "This exam link has already been used.",
    };
    throw new Error(reasonMessages[result.reason] || "This link is not valid.");
  }

  // 3. Refresh local auth store so the client sees the updated status
  try {
    await pb.collection(PROFILES_COLLECTION).authRefresh();
  } catch (_) {
    // Non-fatal — the claim succeeded server-side
  }

  return result;
}

/* ------------------------------------------------------------
   EXAM SESSION
   ------------------------------------------------------------ */

/**
 * Start a new exam attempt.
 * Server: validates eligibility, picks random questions, creates attempt.
 * Errors:
 *   409 -> attempt already in progress (err.response.data.attemptId)
 *   403 -> not eligible / attempts exhausted
 *   400 -> not enough questions in bank
 */
export async function startExam() {
  return pb.send("/api/exam/start", { method: "POST" });
}

/**
 * Resume the current in-progress attempt.
 * Throws 404 if nothing in progress.
 */
export async function resumeExam() {
  return pb.send("/api/exam/resume", { method: "GET" });
}

/**
 * Submit an attempt. Idempotent.
 */
export async function submitExam(attemptId) {
  return pb.send("/api/exam/submit", {
    method: "POST",
    body: { attempt: attemptId },
  });
}

/**
 * Abandon the current attempt and start fresh (limited by resets).
 */
export async function abandonExam() {
  return pb.send("/api/exam/abandon", { method: "POST" });
}

/**
 * Fetch the student's most recent released result with safe
 * question fields. Returns null if no released attempt exists.
 */
export async function getReleasedResult() {
  const res = await pb.send("/api/exam/result", { method: "GET" });
  return res.result || null;
}