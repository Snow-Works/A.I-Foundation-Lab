// src/services/adminStatusService.js
import pbAdmin from "../lib/pocketbase";

export async function getSystemStatus() {
  return pbAdmin.send("/api/admin/status", { method: "GET" });
}

export async function forceSweepStalledExams() {
  return pbAdmin.send("/api/admin/sweep", { method: "POST" });
}