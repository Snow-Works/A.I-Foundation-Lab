// src/services/adminUserService.js
import pbAdmin from "../lib/pocketbaseAdmin";
import { logAdminAction } from "./adminAuditService.js";

const PROFILES = "profiles";
const ADMINS = "admins";

/* ------------------------------------------------------------
   List students with pagination, search, and status filter.
   ------------------------------------------------------------ */
export async function listUsers({
  page = 1,
  perPage = 30,
  search = "",
  statusFilter = "all",
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

  const filter = filters.join(" && ");

  const result = await pbAdmin.collection(PROFILES).getList(page, perPage, {
    filter: filter || undefined,
    sort: "-created",
    expand: "approved_by",
  });

  return result;
}

/* ------------------------------------------------------------
   Fetch a single student record.
   ------------------------------------------------------------ */
export async function getUser(id) {
  return pbAdmin.collection(PROFILES).getOne(id);
}

/* ------------------------------------------------------------
   Approve a student. Sets status to APPROVED.
   ------------------------------------------------------------ */
export async function approveUser(id, adminId) {
  const updated = await pbAdmin.collection(PROFILES).update(id, {
    status: "APPROVED",
    approved_by: adminId,
    approved_at: new Date().toISOString(),
  });

  // Log the action
  await logAdminAction("approved_user", "profile", id, { email: updated.email });
  
  return updated;
}

/* ------------------------------------------------------------
   Reject a student. Sets status to REJECTED with optional note.
   ------------------------------------------------------------ */
export async function rejectUser(id, adminId, reason = "") {
  const updated = await pbAdmin.collection(PROFILES).update(id, {
    status: "REJECTED",
    approved_by: adminId,
    approved_at: new Date().toISOString(),
    notes: reason,
  });

  // Log the action
  await logAdminAction("rejected_user", "profile", id, { email: updated.email, reason });
  
  return updated;
}

/* ------------------------------------------------------------
   Build the full URL for a student's profile photo (if any).
   ------------------------------------------------------------ */
export function adminPhotoUrl(record, thumb = "128x128") {
  if (!record || !record.photo) return null;
  try {
    return pbAdmin.files.getUrl(record, record.photo, { thumb });
  } catch (_) {
    return null;
  }
}

/* ------------------------------------------------------------
   Statistics for the overview page.
   ------------------------------------------------------------ */
export async function getUserStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    pbAdmin.collection(PROFILES).getList(1, 1),
    pbAdmin
      .collection(PROFILES)
      .getList(1, 1, { filter: 'status = "EMAIL_VERIFIED"' }),
    pbAdmin
      .collection(PROFILES)
      .getList(1, 1, { filter: 'status != "EMAIL_VERIFIED" && status != "REGISTERED" && status != "REJECTED"' }),
    pbAdmin
      .collection(PROFILES)
      .getList(1, 1, { filter: 'status = "REJECTED"' }),
  ]);

  return {
    total: total.totalItems,
    pending: pending.totalItems,
    approved: approved.totalItems,
    rejected: rejected.totalItems,
  };
}