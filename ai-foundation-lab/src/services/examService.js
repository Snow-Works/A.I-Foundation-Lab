// src/services/examService.js
import pb from "../lib/pocketbase";

const PROFILES_COLLECTION = "profiles";

/* ------------------------------------------------------------
   GATE TOKEN
   ------------------------------------------------------------ */

export async function validateGateTokenById(recordId) {
  return pb.send(`/api/gate/validate?id=${encodeURIComponent(recordId)}`, {
    method: "GET",
  });
}

export async function claimGateToken(recordId) {
  return pb.send("/api/gate/claim", {
    method: "POST",
    body: { recordId },
  });
}

export async function confirmIdentityAndClaimToken({
  recordId,
  email,
  password,
}) {
  await pb.collection(PROFILES_COLLECTION).authWithPassword(email, password);
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

  try {
    await pb.collection(PROFILES_COLLECTION).authRefresh();
  } catch (_) {}

  return result;
}

/* ------------------------------------------------------------
   EXAM SESSION
   ------------------------------------------------------------ */

export async function startExam() {
  return pb.send("/api/exam/start", { method: "POST" });
}

export async function resumeExam() {
  return pb.send("/api/exam/resume", { method: "GET" });
}

export async function submitExam(attemptId) {
  return pb.send("/api/exam/submit", {
    method: "POST",
    body: { attempt: attemptId },
  });
}

export async function abandonExam() {
  return pb.send("/api/exam/abandon", { method: "POST" });
}

export async function getReleasedResult() {
  const res = await pb.send("/api/exam/result", { method: "GET" });
  return res.result || null;
}

export async function getLeaderboard(batch = "") {
  const query = batch ? `?batch=${encodeURIComponent(batch)}` : "";
  return pb.send(`/api/leaderboard${query}`, { method: "GET" });
}