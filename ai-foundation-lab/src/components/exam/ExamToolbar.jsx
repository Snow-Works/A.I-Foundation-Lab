// src/components/exam/ExamToolbar.jsx
import { Clock, Save, Send } from "lucide-react";
import Button from "../ui/Button.jsx";

/**
 * ExamToolbar — top bar with timer, progress, and submit.
 *
 * The timer is a static placeholder for now; the real countdown
 * arrives in Step 5.9.
 */
export default function ExamToolbar({
  attempt,
  answeredCount,
  totalCount,
  currentIndex,
  onSubmit,
}) {
  // Format the deadline as HH:MM:SS placeholder
  const deadlineLabel = attempt?.deadline_at
    ? new Date(attempt.deadline_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <header className="exam-toolbar">
      <div className="exam-toolbar__left">
        <span className="exam-toolbar__badge">Exam in progress</span>
      </div>

      <div className="exam-toolbar__center">
        <Clock size={16} className="exam-toolbar__icon" />
        <span className="exam-toolbar__timer">--:--</span>
        <span className="exam-toolbar__deadline">
          Ends {deadlineLabel}
        </span>
      </div>

      <div className="exam-toolbar__right">
        <span className="exam-toolbar__progress">
          Q{currentIndex + 1} of {totalCount} · {answeredCount} answered
        </span>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Send size={14} />}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </header>
  );
}