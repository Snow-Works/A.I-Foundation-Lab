// src/services/adminUserService.js
import pbAdmin from "../lib/pocketbase";
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
    filters.push(
      `(first_name ~ "${q}" || surname ~ "${q}" || middle_name ~ "${q}" || email ~ "${q}")`
    );
  }

  if (statusFilter && statusFilter !== "all") {
    filters.push(`status = "${statusFilter}"`);
  }

  if (batchFilter && batchFilter !== "all") {
    filters.push(`batch = "${batchFilter.replace(/"/g, '\\"')}"`);
  }

  const filter = filters.join(" && ");

  const result = await pbAdmin.collection(PROFILES).getList(page, perPage, {
    filter: filter || undefined,
    sort: "-created",
    expand: "approved_by",
  });

  return result;
}

export async function getBatches() {
  try {
    const result = await pbAdmin.collection(PROFILES).getList(1, 500, {
      fields: "batch",
    });
    const batches = [...new Set(result.items.map((i) => i.batch).filter(Boolean))];
    return batches.sort();
  } catch (err) {
    console.error("[admin-users] getBatches error:", err);
    return [];
  }
}

export async function getUser(id) {
  return pbAdmin.collection(PROFILES).getOne(id);
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
  return pbAdmin.send("/api/admin/users/delete", {
    method: "POST",
    body: { userId: id },
  });
}

export function adminPhotoUrl(record, thumb = "128x128") {
  if (!record || !record.photo) return null;
  try {
    return pbAdmin.files.getUrl(record, record.photo, { thumb });
  } catch (_) {
    return null;
  }
}

export async function getUserStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    pbAdmin.collection(PROFILES).getList(1, 1),
    pbAdmin.collection(PROFILES).getList(1, 1, { filter: 'status = "EMAIL_VERIFIED"' }),
    pbAdmin.collection(PROFILES).getList(1, 1, { filter: 'status != "EMAIL_VERIFIED" && status != "REGISTERED" && status != "REJECTED"' }),
    pbAdmin.collection(PROFILES).getList(1, 1, { filter: 'status = "REJECTED"' }),
  ]);

  return {
    total: total.totalItems,
    pending: pending.totalItems,
    approved: approved.totalItems,
    rejected: rejected.totalItems,
  };
}