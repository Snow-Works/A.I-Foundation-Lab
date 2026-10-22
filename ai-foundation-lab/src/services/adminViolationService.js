// src/services/adminViolationService.js
import pbAdmin from "../lib/pocketbaseAdmin";

export async function listViolations({
  page = 1,
  perPage = 30,
  search = "",
  typeFilter = "all",
} = {}) {
  const filters = [];

  if (search.trim()) {
    const q = search.trim().replace(/"/g, '\\"');
    filters.push(`(student.first_name ~ "${q}" || student.surname ~ "${q}" || student.email ~ "${q}")`);
  }

  if (typeFilter && typeFilter !== "all") {
    filters.push(`type = "${typeFilter}"`);
  }

  const filter = filters.join(" && ");

  return pbAdmin.collection("violations").getList(page, perPage, {
    filter: filter || undefined,
    sort: "-occurred_at",
    expand: "student,attempt",
  });
}