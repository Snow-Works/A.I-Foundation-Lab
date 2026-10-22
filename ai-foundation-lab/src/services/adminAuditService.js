// src/services/adminAuditService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "audit_log";

/**
 * Logs an admin action. Fails silently (console error only) so it never
 * breaks the main workflow if the audit log fails to write.
 */
export async function logAdminAction(action, targetType, targetId, details = {}) {
  const admin = pbAdmin.authStore.model;
  if (!admin) return; // Only log if an admin is authenticated

  try {
    await pbAdmin.collection(COLLECTION).create({
      actor: admin.name || admin.email,
      actor_type: "admin",
      action: action,
      target_type: targetType,
      target_id: targetId,
      details: details,
      occurred_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[audit-log] Failed to write log:", err);
  }
}

export async function listAuditLogs({ page = 1, perPage = 50, search = "", actionFilter = "all" } = {}) {
  const filters = [];

  if (search.trim()) {
    const q = search.trim().replace(/"/g, '\\"');
    filters.push(`(actor ~ "${q}" || action ~ "${q}" || target_id ~ "${q}")`);
  }

  if (actionFilter && actionFilter !== "all") {
    filters.push(`action = "${actionFilter}"`);
  }

  const filter = filters.join(" && ");

  return pbAdmin.collection(COLLECTION).getList(page, perPage, {
    filter: filter || undefined,
    sort: "-occurred_at",
  });
}