import pbAdmin from "../lib/pocketbaseAdmin"; 
import { logAdminAction } from "./adminAuditService.js";

const PROFILES = "profiles";

export async function listUsers({
  page = 1,
  perPage = 30,
  search = "",
  statusFilter = "all",
  batchFilter = "all",
} = {}) {
  const filters = [];

  if (search && search.trim()) {
    const q = search.trim().replace(/"/g, '\\"');
    filters.push(`(first_name ~ "${q}" || surname ~ "${q}" || middle_name ~ "${q}" || email ~ "${q}")`);
  }
  if (statusFilter && statusFilter !== "all") filters.push(`status = "${statusFilter}"`);
  if (batchFilter && batchFilter !== "all") filters.push(`batch = "${batchFilter.replace(/"/g, '\\"')}"`);

  const filter = filters.join(" && ");

  // REMOVED expand: "approved_by" to fix the 400 error
  return pbAdmin.collection(PROFILES).getList(page, perPage, {
    filter: filter || undefined,
    sort: "-created",
  });
}

export async function getBatches() {
  try {
    const result = await pbAdmin.collection(PROFILES).getList(1, 500, { fields: "batch" });
    const batches = [...new Set(result.items.map((i) => i.batch).filter(Boolean))];
    return batches.sort();
  } catch (err) {
    return [];
  }
}

export async function approveUser(id, adminId) {
  const updated = await pbAdmin.collection(PROFILES).update(id, {
    status: "APPROVED",
    approved_by: adminId,
    approved_at: new Date().toISOString(),
  });
  await logAdminAction("approved_user", "profile", id, { email: updated.email });
  return updated;
}

export async function rejectUser(id, adminId, reason = "") {
  const updated = await pbAdmin.collection(PROFILES).update(id, {
    status: "REJECTED",
    approved_by: adminId,
    approved_at: new Date().toISOString(),
    notes: reason,
  });
  await logAdminAction("rejected_user", "profile", id, { email: updated.email, reason });
  return updated;
}

export async function deleteUser(id) {
  return pbAdmin.collection(PROFILES).delete(id);
}

export function adminPhotoUrl(record, thumb = "128x128") {
  if (!record || !record.photo) return null;
  return pbAdmin.files.getUrl(record, record.photo, { thumb });
}