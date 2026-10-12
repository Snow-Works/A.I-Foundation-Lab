// src/services/settingsService.js
import pb from "../lib/pocketbase";

const COLLECTION = "app_settings";

/**
 * Get the single settings row.
 * Returns null if no settings row has been created yet.
 * Cached for 60 seconds in-memory to avoid hammering the backend.
 */
let cache = null;
let cacheTime = 0;
const TTL_MS = 60_000;

export async function getAppSettings({ force = false } = {}) {
  const now = Date.now();
  if (!force && cache && now - cacheTime < TTL_MS) {
    return cache;
  }

  const result = await pb.collection(COLLECTION).getList(1, 1);
  cache = result.items[0] || null;
  cacheTime = now;
  return cache;
}

/**
 * Invalidate the in-memory cache (call after admin edits settings).
 */
export function invalidateSettingsCache() {
  cache = null;
  cacheTime = 0;
}