// src/services/profileService.js
import pb from "../lib/pocketbase";

const COLLECTION = "profiles";

/* ---------- Get a single profile ---------- */
export async function getProfile(id) {
  return pb.collection(COLLECTION).getOne(id);
}

/* ---------- Update ---------- */
export async function updateProfile(id, data) {
  return pb.collection(COLLECTION).update(id, data);
}

/* ------------------------------------------------------------
   Upload the profile photo and mark the user as photo-verified.
   Automatically bumps the status to PHOTO_VERIFIED if the user
   is at an earlier stage. Syncs the auth store so the UI
   reflects the change without a manual refresh.
   ------------------------------------------------------------ */
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

  // If this record is the current user, sync the auth store
  if (pb.authStore.model?.id === id) {
    pb.authStore.save(pb.authStore.token, updated);
  }

  return updated;
}

/* ---------- Compute full photo URL ---------- */
export function photoUrl(record, thumb = null) {
  if (!record || !record.photo) return null;
  return pb.files.getUrl(record, record.photo, thumb ? { thumb } : {});
}