// src/services/adminMarkingService.js
import pbAdmin from "../lib/pocketbaseAdmin";
import { logAdminAction } from "./adminAuditService.js";

const PASS_MARK = 180; // The threshold for certification

export async function listSubmissions({ page = 1, perPage = 50 } = {}) {
  // Fetch everything that is no longer in progress
  const filter = `status != "in_progress"`;
  
  return pbAdmin.collection("attempts").getList(page, perPage, {
    filter,
    sort: "-submitted_at",
    expand: "student",
  });
}

export async function listMarkedResults() {
  // Fetch only attempts that have been marked and released
  const attempts = await pbAdmin.collection("attempts").getFullList({
    filter: `status = "released"`,
    sort: "-updated",
    expand: "student",
  });

  // Calculate scores for each attempt
  const results = await Promise.all(
    attempts.map(async (attempt) => {
      const marks = await pbAdmin.collection("marks").getFullList({
        filter: `attempt_question.attempt = "${attempt.id}"`,
      });

      let totalScore = 0;
      let maxScore = 0;

      marks.forEach((m) => {
        totalScore += Number(m.score) || 0;
        maxScore += Number(m.max_score) || 10;
      });

      return {
        ...attempt,
        totalScore,
        maxScore,
        passed: totalScore >= PASS_MARK,
      };
    })
  );

  return results;
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
  // 1. Update attempt status
  await pbAdmin.collection("attempts").update(attemptId, {
    status: "released",
  });

  // 2. Update student profile status
  await pbAdmin.collection("profiles").update(studentId, {
    status: "MARKED",
  });

  await logAdminAction("released_results", "attempt", attemptId, { studentId });
}