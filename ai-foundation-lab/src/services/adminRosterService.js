// src/services/adminRosterService.js
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "roster";

export async function listRoster({ page = 1, perPage = 50, search = "" } = {}) {
  const filter = search.trim()
    ? `(first_name ~ "${search.trim().replace(/"/g, '\\"')}" || surname ~ "${search.trim().replace(/"/g, '\\"')}" || batch ~ "${search.trim().replace(/"/g, '\\"')}")`
    : undefined;

  return pbAdmin.collection(COLLECTION).getList(page, perPage, {
    filter,
    sort: "surname,first_name",
  });
}

export async function getRosterCount() {
  const result = await pbAdmin.collection(COLLECTION).getList(1, 1);
  return result.totalItems;
}

export async function uploadRoster(entries) {
  const res = await pbAdmin.send("/api/admin/roster/upload", {
    method: "POST",
    body: { entries },
  });
  return res;
}

export async function deleteRosterEntry(id) {
  return pbAdmin.collection(COLLECTION).delete(id);
}

export async function clearAllRoster() {
  const all = await pbAdmin.collection(COLLECTION).getFullList();
  let deleted = 0;
  for (const r of all) {
    try {
      await pbAdmin.collection(COLLECTION).delete(r.id);
      deleted++;
    } catch (err) {
      console.warn("[roster] failed to delete", r.id, err);
    }
  }
  return deleted;
}