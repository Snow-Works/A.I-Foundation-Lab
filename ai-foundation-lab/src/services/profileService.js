// src/services/profileService.js
import pb from "../lib/pocketbase";

const COLLECTION = "profiles";

export async function getProfile(id) {
  return pb.collection(COLLECTION).getOne(id);
}

export async function updateProfile(id, data) {
  return pb.collection(COLLECTION).update(id, data);
}

const PRIOR_STATES = ["REGISTERED", "EMAIL_VERIFIED", "APPROVED"];

export async function uploadProfilePhoto(id, file, currentStatus) {
  const form = new FormData();
  form.append("photo", file, "profile.webp");
  form.append("photo_verified", "true");
  form.append("photo_verified_at", new Date().toISOString());

  if (PRIOR_STATES.includes(currentStatus)) {
    form.append("status", "PHOTO_VERIFIED");
  }

  const updated = await pb.collection(COLLECTION).update(id, form);

  if (pb.authStore.model?.id === id) {
    pb.authStore.save(pb.authStore.token, updated);
  }

  return updated;
}

export function photoUrl(record, thumb = null) {
  if (!record || !record.photo) return null;
  return pb.files.getUrl(record, record.photo, thumb ? { thumb } : {});
}

/* ------------------------------------------------------------
   Fetch the student's released exam result with full transcript.
   ------------------------------------------------------------ */
export async function getReleasedExamResult(studentId) {
  try {
    const attempts = await pb.collection("attempts").getList(1, 1, {
      filter: `student = "${studentId}" && status = "released"`,
      sort: "-updated",
    });

    if (attempts.items.length === 0) return null;
    const attempt = attempts.items[0];

    const attemptQuestions = await pb.collection("attempt_questions").getFullList({
      filter: `attempt = "${attempt.id}"`,
      sort: "order",
      expand: "question",
    });

    const answers = await pb.collection("answers").getFullList({
      filter: `attempt = "${attempt.id}"`,
    });

    const marks = await pb.collection("marks").getFullList({
      filter: `attempt_question.attempt = "${attempt.id}"`,
    });

    const questions = attemptQuestions.map((aq) => {
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

    let totalScore = 0;
    let maxScore = 0;
    questions.forEach((q) => {
      if (q.mark) {
        totalScore += Number(q.mark.score) || 0;
        maxScore += Number(q.mark.max_score) || 10;
      }
    });

    return {
      attempt,
      student: pb.authStore.model, // Since this is the student themselves
      questions,
      totalScore,
      maxScore,
      passed: totalScore >= 180,
    };
  } catch (err) {
    console.error("[profile] get exam result error:", err);
    return null;
  }
}