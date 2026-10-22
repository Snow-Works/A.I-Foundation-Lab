// src/services/adminMarkingService.js
import pbAdmin from "../lib/pocketbaseAdmin";
import { logAdminAction } from "./adminAuditService.js";

export async function listSubmissions({ page = 1, perPage = 20, status = "submitted" } = {}) {
  const filters = [];
  if (status === "submitted") filters.push(`status = "submitted"`);
  if (status === "marked") filters.push(`status = "marked"`);
  if (status === "released") filters.push(`status = "released"`);

  return pbAdmin.collection("attempts").getList(page, perPage, {
    filter: filters.join(" && "),
    sort: "-submitted_at",
    expand: "student",
  });
}

export async function getSubmissionDetails(attemptId) {
  const attempt = await pbAdmin.collection("attempts").getOne(attemptId, {
    expand: "student",
  });

  const attemptQuestions = await pbAdmin.collection("attempt_questions").getFullList({
    filter: `attempt = "${attemptId}"`,
    sort: "order",
    expand: "question",
  });

  const answers = await pbAdmin.collection("answers").getFullList({
    filter: `attempt = "${attemptId}"`,
  });

  const marks = await pbAdmin.collection("marks").getFullList({
    filter: `attempt_question.attempt = "${attemptId}"`,
  });

  const questionsWithAnswersAndMarks = attemptQuestions.map((aq) => {
    const answer = answers.find((a) => a.question === aq.question);
    const mark = marks.find((m) => m.attempt_question === aq.id);
    return {
      attempt_question_id: aq.id,
      order: aq.order,
      question: aq.expand.question,
      answer: answer ? answer.body : "",
      mark: mark || null,
    };
  });

  return {
    attempt,
    student: attempt.expand.student,
    questions: questionsWithAnswersAndMarks,
  };
}

export async function saveMark({ attemptQuestionId, adminId, score, maxScore, comment }) {
  let existingMark = null;
  try {
    const list = await pbAdmin.collection("marks").getList(1, 1, {
      filter: `attempt_question = "${attemptQuestionId}"`,
    });
    existingMark = list.items[0];
  } catch (err) {
    // ignore
  }

  const data = {
    attempt_question: attemptQuestionId,
    score: Number(score),
    max_score: Number(maxScore),
    comment: comment || "",
    marked_by: adminId,
    marked_at: new Date().toISOString(),
    released: false,
  };

  if (existingMark) {
    return pbAdmin.collection("marks").update(existingMark.id, data);
  } else {
    return pbAdmin.collection("marks").create(data);
  }
}

export async function releaseResults(attemptId, studentId) {
  await pbAdmin.collection("attempts").update(attemptId, {
    status: "released",
  });

  await pbAdmin.collection("profiles").update(studentId, {
    status: "MARKED",
  });

  // Log the action
  await logAdminAction("released_results", "attempt", attemptId, { studentId });
}