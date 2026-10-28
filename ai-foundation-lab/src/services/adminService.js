// src/services/authService.js
import pb from "../lib/pocketbase";

const COLLECTION = "profiles";

export async function register(data) {
  const record = await pb.collection(COLLECTION).create({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    first_name: data.first_name,
    middle_name: data.middle_name || "",
    surname: data.surname,
    whatsapp: data.whatsapp,
    batch: data.batch || "",
    status: "REGISTERED",
  });
  return record;
}

export async function login(email, password) {
  const auth = await pb.collection(COLLECTION).authWithPassword(email, password);
  return auth;
}

export function logout() {
  pb.authStore.clear();
}

export function getCurrentUser() {
  return pb.authStore.isValid ? pb.authStore.model : null;
}

export function isAuthenticated() {
  return pb.authStore.isValid;
}

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

export async function confirmVerification(token) {
  return pb.collection(COLLECTION).confirmVerification(token);
}

export async function requestVerification(email) {
  return pb.collection(COLLECTION).requestVerification(email);
}

export async function requestPasswordReset(email) {
  return pb.collection(COLLECTION).requestPasswordReset(email);
}

export async function confirmPasswordReset(token, password, passwordConfirm) {
  return pb
    .collection(COLLECTION)
    .confirmPasswordReset(token, password, passwordConfirm);
}

export async function updateProfile(id, data) {
  return pb.collection(COLLECTION).update(id, data);
}

export async function getProfile(id) {
  return pb.collection(COLLECTION).getOne(id);
}