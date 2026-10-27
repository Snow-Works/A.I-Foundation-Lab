// src/services/adminGateService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "gate_tokens";

/**
 * Fetching all gate tokens, sorted by newest first.
 * Returns the full list of tokens for the admin history table.
 */
export async function listGateTokens() {
  return pbAdmin.collection(COLLECTION).getFullList({
    sort: "-created",
  });
}

/**
 * Generate a new gate token.
 * @param {number} expiryHours - How long the token is valid for.
 * @param {number} maxUses - How many students can use this link.
 * @returns {Object} The newly created token record.
 */
export async function createGateToken(expiryHours, maxUses) {
  // Generate a random 24-character hex string to act as the unique token
  const token = crypto.randomBytes(24).toString("hex");
  
  // Calculate the exact expiry date based on the current time
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  return pbAdmin.collection(COLLECTION).create({
    token: token,
    expires_at: expiresAt,
    max_uses: Number(maxUses),
    revoked: false,
  });
}

/**
 * Revoke a token instantly.
 * Sets the 'revoked' flag to true, which the frontend checks when a student clicks the link.
 */
export async function revokeGateToken(id) {
  return pbAdmin.collection(COLLECTION).update(id, {
    revoked: true,
  });
}