// src/services/adminGateService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "gate_tokens";

export async function listGateTokens() {
  return pbAdmin.collection(COLLECTION).getFullList({
    sort: "-created",
  });
}

/**
 * Generate a random hex string using the browser's native crypto API.
 * (Replaces the Node.js crypto.randomBytes which crashed the browser).
 */
function generateRandomToken(length = 24) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createGateToken(expiryHours, maxUses) {
  const token = generateRandomToken(24);
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  return pbAdmin.collection(COLLECTION).create({
    token: token,
    expires_at: expiresAt,
    max_uses: Number(maxUses),
    revoked: false,
  });
}

export async function revokeGateToken(id) {
  return pbAdmin.collection(COLLECTION).update(id, {
    revoked: true,
  });
}