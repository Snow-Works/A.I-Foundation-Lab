// src/services/adminService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "admins";

export async function loginAdmin(email, password) {
  const auth = await pbAdmin.collection(COLLECTION).authWithPassword(email, password);
  return auth;
}

export function logoutAdmin() {
  pbAdmin.authStore.clear();
}

export function getCurrentAdmin() {
  return pbAdmin.authStore.isValid ? pbAdmin.authStore.model : null;
}

export function isAdminAuthenticated() {
  return pbAdmin.authStore.isValid;
}