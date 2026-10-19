// src/services/adminSettingsService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "app_settings";

export async function getSettings() {
  const result = await pbAdmin.collection(COLLECTION).getList(1, 1);
  return result.items[0] || null;
}

export async function updateSettings(id, data) {
  return pbAdmin.collection(COLLECTION).update(id, data);
}