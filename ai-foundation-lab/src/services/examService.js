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

export async function getLeaderboard(batchFilter = "") {
  //  Build the filter (only released exams)
  let filter = 'status = "released"';
  if (batchFilter) {
    filter += ` && student.batch = "${batchFilter}"`;
  }

  //  Fetch attempts, expand the student profile, and sort by highest score
  const records = await pb.collection("attempts").getFullList({
    filter: filter,
    expand: "student",
    sort: "-score_total",
  });

  //  Format the data to match exactly what Leaderboard.jsx expects
  const leaderboard = records.map((record, index) => {
    const student = record.expand?.student || {};
    return {
      studentId: record.student,
      rank: index + 1,
      first_name: student.first_name || "Unknown",
      surname: student.surname || "",
      batch: student.batch || "N/A",
      totalScore: record.score_total || 0,
      maxScore: record.score_max || 0,
      // Pass mark logic (matches your admin marking logic: 180 out of 250)
      passed: (record.score_total || 0) >= 180,
    };
  });

  //  Fetch available batches so the dropdown filter works
  const profiles = await pb.collection("profiles").getFullList({ fields: "batch" });
  const batches = [...new Set(profiles.map(p => p.batch).filter(Boolean))].sort();

  return { leaderboard, batches };
}