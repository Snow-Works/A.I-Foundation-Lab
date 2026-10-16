// src/components/exam/QuestionNav.jsx
import { Check } from "lucide-react";

/**
 * QuestionNav — sidebar list of all questions.
 * Shows which are answered and highlights the current one.
 */
export default function QuestionNav({
  questions,
  answers,
  currentIndex,
  onJump,
}) {
  return (
    <nav className="question-nav" aria-label="Exam questions">
      <div className="question-nav__header">
        <span className="question-nav__label">Questions</span>
        <span className="question-nav__count">
          {questions.length}
        </span>
      </div>

      <ol className="question-nav__list">
        {questions.map((q, i) => {
          const answered = !!(answers[q.id] && answers[q.id].trim());
          const active = i === currentIndex;

          return (
            <li key={q.id}>
              <button
                type="button"
                className={[
                  "question-nav__item",
                  active && "question-nav__item--active",
                  answered && "question-nav__item--answered",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onJump(i)}
                aria-current={active ? "step" : undefined}
              >
                <span className="question-nav__num">
                  {answered ? <Check size={12} strokeWidth={3} /> : `Q${i + 1}`}
                </span>
                <span className="question-nav__title">{q.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}