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
 * Fetch the General Community link.
 * Server-enforced: returns the URL only if the caller is
 * an admin or a photo-verified user.
 */
export async function getCommunityLink() {
  try {
    const settings = await getAppSettings({ force: true });
    if (!settings) return { url: null, enabled: false };

    const enabled = !!settings.telegram_enabled;
    const url = settings.telegram_group_url || "";

    return { url, enabled };
  } catch (err) {
    const status = err?.status || err?.response?.code;
    if (status === 403 || status === 404) {
      return { url: null, enabled: false };
    }
    throw err;
  }
}

/**
 * Fetch the Exam Community link.
 * Server-enforced: returns the URL only if the caller is
 * an admin or a photo-verified user.
 */
export async function getExamCommunityLink() {
  try {
    const settings = await getAppSettings({ force: true });
    if (!settings) return { url: null, enabled: false };

    const enabled = !!settings.exam_telegram_enabled;
    const url = settings.exam_telegram_group_url || "";

    return { url, enabled };
  } catch (err) {
    const status = err?.status || err?.response?.code;
    if (status === 403 || status === 404) {
      return { url: null, enabled: false };
    }
    throw err;
  }
}

/**
 * Invalidate the in-memory cache (call after admin edits settings).
 */
export function invalidateSettingsCache() {
  cache = null;
  cacheTime = 0;
}