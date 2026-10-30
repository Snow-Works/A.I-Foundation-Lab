// src/services/authService.js
import pb from "../lib/pocketbase";

/**
 * All auth operations for students (profiles collection).
 * Admin auth is separate — see adminService (added later).
 */

const COLLECTION = "profiles";

/* ---------- Register ---------- */
/**
 * Create a new profile account.
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.passwordConfirm
 * @param {string} data.first_name
 * @param {string} [data.middle_name]
 * @param {string} data.surname
 * @param {string} data.whatsapp  - E.164 format, e.g. "+2348012345678"
 * @returns {Promise<Object>} the created profile record
 */
export async function register(data) {
  const record = await pb.collection(COLLECTION).create({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    first_name: data.first_name,
    middle_name: data.middle_name || "",
    surname: data.surname,
    whatsapp: data.whatsapp,
    status: "REGISTERED",
  });
  return record;
}

/* ---------- Log in ---------- */
export async function login(email, password) {
  const auth = await pb
    .collection(COLLECTION)
    .authWithPassword(email, password);
  return auth;
}

/* ---------- Log out ---------- */
export function logout() {
  pb.authStore.clear();
}

/* ---------- Current user ---------- */
export function getCurrentUser() {
  return pb.authStore.isValid ? pb.authStore.model : null;
}

export function isAuthenticated() {
  return pb.authStore.isValid;
}

/* ---------- Refresh auth ---------- */
/**
 * Ask PocketBase to re-validate the current session and refresh the
 * user record. Returns null if the session is no longer valid.
 */
export async function refreshAuth() {
  if (!pb.authStore.isValid) return null;
  try {
    const auth = await pb.collection(COLLECTION).authRefresh();
    return auth;
  } catch {
    pb.authStore.clear();
    return null;
  }
}

/* ---------- Verify email ---------- */
/**
 * Called after the user clicks the verification link in their inbox.
 * PocketBase puts `token` and `email` in the URL query params.
 */
export async function confirmVerification(token) {
  return pb.collection(COLLECTION).confirmVerification(token);
}

/* ---------- Resend verification ---------- */
export async function requestVerification(email) {
  return pb.collection(COLLECTION).requestVerification(email);
}

/* ---------- Password reset ---------- */
export async function requestPasswordReset(email) {
  return pb.collection(COLLECTION).requestPasswordReset(email);
}

export async function confirmPasswordReset(token, password, passwordConfirm) {
  return pb
    .collection(COLLECTION)
    .confirmPasswordReset(token, password, passwordConfirm);
}

/* ---------- Update own profile ---------- */
export async function updateProfile(id, data) {
  return pb.collection(COLLECTION).update(id, data);
}

/* ---------- Get profile by id ---------- */
export async function getProfile(id) {
  return pb.collection(COLLECTION).getOne(id);
}