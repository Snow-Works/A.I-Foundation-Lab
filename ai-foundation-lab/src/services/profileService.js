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

/* ---------- Upload profile photo ---------- */
/**
 * Upload the verified profile photo. The photo must already be
 * compressed to WebP before calling this. PocketBase handles
 * storage and returns the record with an updated photo URL.
 *
 * @param {string} id          - profile id
 * @param {File|Blob} file     - the compressed photo
 */
export async function uploadProfilePhoto(id, file) {
  const form = new FormData();
  form.append("photo", file);
  return pb.collection(COLLECTION).update(id, form);
}

/* ---------- Compute full photo URL ---------- */
export function photoUrl(record) {
  if (!record || !record.photo) return null;
  return pb.files.getUrl(record, record.photo);
}