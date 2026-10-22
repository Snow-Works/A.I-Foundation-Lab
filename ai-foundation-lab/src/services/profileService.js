// src/services/profileService.js
import pb from "../lib/pocketbase";

const COLLECTION = "profiles";

export async function getProfile(id) {
  return pb.collection(COLLECTION).getOne(id);
}

export async function updateProfile(id, data) {
  return pb.collection(COLLECTION).update(id, data);
}

const PRIOR_STATES = ["REGISTERED", "EMAIL_VERIFIED", "APPROVED"];

export async function uploadProfilePhoto(id, file, currentStatus) {
  const form = new FormData();
  form.append("photo", file, "profile.webp");
  form.append("photo_verified", "true");
  form.append("photo_verified_at", new Date().toISOString());

  if (PRIOR_STATES.includes(currentStatus)) {
    form.append("status", "PHOTO_VERIFIED");
  }

  const updated = await pb.collection(COLLECTION).update(id, form);

  if (pb.authStore.model?.id === id) {
    pb.authStore.save(pb.authStore.token, updated);
  }

  return updated;
}

export function photoUrl(record, thumb = null) {
  if (!record || !record.photo) return null;
  return pb.files.getUrl(record, record.photo, thumb ? { thumb } : {});
}

/* ------------------------------------------------------------
   Fetch the student's released exam result.
   Returns { attempt, totalScore, maxScore } or null.
   ------------------------------------------------------------ */
export async function getReleasedExamResult(studentId) {
  try {
    // 1. Get the latest released attempt
    const attempts = await pb.collection("attempts").getList(1, 1, {
      filter: `student = "${studentId}" && status = "released"`,
      sort: "-updated",
    });

    if (attempts.items.length === 0) return null;
    const attempt = attempts.items[0];

    // 2. Get all marks for this attempt
    const marks = await pb.collection("marks").getFullList({
      filter: `attempt_question.attempt = "${attempt.id}"`,
    });

    // 3. Calculate total score
    let totalScore = 0;
    let maxScore = 0;
    
    for (const mark of marks) {
      totalScore += Number(mark.score) || 0;
      maxScore += Number(mark.max_score) || 0;
    }

    return {
      attempt,
      totalScore,
      maxScore,
    };
  } catch (err) {
    console.error("[profile] get exam result error:", err);
    return null;
  }
}