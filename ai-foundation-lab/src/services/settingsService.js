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
 * Fetch the community link. Server-enforced — the API rule on
 * app_settings returns the URL only if the caller is an admin or
 * a photo-verified user.
 *
 * Returns { url, enabled } or null if not eligible / not configured.
 */
export async function getCommunityLink() {
  try {
    const settings = await getAppSettings({ force: true });
    if (!settings) return { url: null, enabled: false };

    const enabled = !!settings.telegram_enabled;
    const url = settings.telegram_group_url || "";

    return { url, enabled };
  } catch (err) {
    // A 403/404 here means the API rule blocked the read
    // (user isn't photo-verified) or the row doesn't exist.
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