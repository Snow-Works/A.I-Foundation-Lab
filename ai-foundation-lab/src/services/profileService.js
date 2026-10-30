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
   Fetch the student's most recent RELEASED exam result with
   full transcript. Delegated to /api/exam/result because the
   `questions` collection is now admins-only — the student
   cannot read question records directly.
   ------------------------------------------------------------ */
export async function getReleasedExamResult() {
  try {
    const res = await pb.send("/api/exam/result", { method: "GET" });
    return res.result || null;
  } catch (err) {
    console.error("[profile] get exam result error:", err);
    return null;
  }
}