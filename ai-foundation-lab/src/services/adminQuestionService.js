// src/services/adminQuestionService.js
import pbAdmin from "../lib/pocketbaseAdmin";
import { logAdminAction } from "./adminAuditService.js";

const COLLECTION = "questions";

export async function listQuestions({
  page = 1,
  perPage = 30,
  search = "",
  difficulty = "all",
} = {}) {
  const filters = [];

  if (search.trim()) {
    const q = search.trim().replace(/"/g, '\\"');
    filters.push(`(title ~ "${q}" || topic ~ "${q}")`);
  }

  if (difficulty && difficulty !== "all") {
    filters.push(`difficulty = "${difficulty}"`);
  }

  const filter = filters.join(" && ");

  return pbAdmin.collection(COLLECTION).getList(page, perPage, {
    filter: filter || undefined,
    sort: "-created",
  });
}

export async function getQuestion(id) {
  return pbAdmin.collection(COLLECTION).getOne(id);
}

export async function createQuestion(data) {
  const record = await pbAdmin.collection(COLLECTION).create(data);
  
  // Log the action
  await logAdminAction("created_question", "question", record.id, { title: record.title });
  
  return record;
}

export async function updateQuestion(id, data) {
  return pbAdmin.collection(COLLECTION).update(id, data);
}

export async function deleteQuestion(id) {
  // Get the title before deleting so we can log it
  const record = await pbAdmin.collection(COLLECTION).getOne(id);
  
  await pbAdmin.collection(COLLECTION).delete(id);
  
  // Log the action
  await logAdminAction("deleted_question", "question", id, { title: record.title });
}

export async function toggleQuestionActive(id, active) {
  return pbAdmin.collection(COLLECTION).update(id, { active });
}








/* ------------------------------------------------------------
   Export all questions to a JSON array for backup.
   ------------------------------------------------------------ */
export async function exportQuestions() {
  const all = await pbAdmin.collection(COLLECTION).getFullList({
    sort: "created",
  });
  
  // Map to a clean format (omit PocketBase system fields like id, collectionId, etc.)
  return all.map((q) => ({
    title: q.title,
    prompt: q.prompt,
    difficulty: q.difficulty,
    topic: q.topic,
    rubric: q.rubric,
    sample_solution: q.sample_solution,
    active: q.active,
  }));
}