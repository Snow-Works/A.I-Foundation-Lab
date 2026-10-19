// src/services/adminDashboardService.js
import pbAdmin from "../lib/pocketbaseAdmin";

export async function getDashboardStats() {
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  // Fire all count requests in parallel.
  const [
    totalUsers,
    pendingUsers,
    rejectedUsers,
    totalAttempts,
    pendingMarking,
    recentViolations,
  ] = await Promise.all([
    pbAdmin.collection("profiles").getList(1, 1),
    pbAdmin
      .collection("profiles")
      .getList(1, 1, { filter: 'status = "EMAIL_VERIFIED"' }),
    pbAdmin
      .collection("profiles")
      .getList(1, 1, { filter: 'status = "REJECTED"' }),
    pbAdmin.collection("attempts").getList(1, 1),
    pbAdmin
      .collection("attempts")
      .getList(1, 1, { filter: 'status = "submitted"' }),
    pbAdmin
      .collection("violations")
      .getList(1, 1, { filter: `occurred_at >= "${yesterday}"` }),
  ]);

  return {
    totalUsers: totalUsers.totalItems,
    pendingUsers: pendingUsers.totalItems,
    rejectedUsers: rejectedUsers.totalItems,
    totalAttempts: totalAttempts.totalItems,
    pendingMarking: pendingMarking.totalItems,
    recentViolations: recentViolations.totalItems,
  };
}

export async function getRecentSubmissions(limit = 5) {
  return pbAdmin.collection("attempts").getList(1, limit, {
    filter: 'status = "submitted"',
    sort: "-submitted_at",
    expand: "student",
  });
}