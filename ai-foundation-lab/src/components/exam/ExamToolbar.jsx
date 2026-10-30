// src/components/exam/ExamToolbar.jsx
import { Clock, Send, Check, Cloud, Loader2 } from "lucide-react";
import Button from "../ui/Button.jsx";

function SaveIndicator({ status }) {
  if (status === "saving") {
    return (
      <span className="exam-toolbar__save exam-toolbar__save--saving">
        <Loader2 size={12} className="exam-toolbar__save-spinner" />
        Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="exam-toolbar__save exam-toolbar__save--saved">
        <Check size={12} />
        Saved
      </span>
    );
  }
  if (status === "offline") {
    return (
      <span className="exam-toolbar__save exam-toolbar__save--offline">
        <Cloud size={12} />
        Offline — retrying
      </span>
    );
  }
  return null;
}

export default function ExamToolbar({
  attempt,
  answeredCount,
  totalCount,
  currentIndex,
  saveStatus,
  timer,
  onSubmit,
}) {
  const timerClass = [
    "exam-toolbar__timer",
    timer?.isUrgent && "exam-toolbar__timer--urgent",
    timer?.isCritical && "exam-toolbar__timer--critical",
  ]
    .filter(Boolean)
    .join(" ");

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
        <SaveIndicator status={saveStatus} />
      </div>

      <div className="exam-toolbar__center">
        <Clock size={16} className="exam-toolbar__icon" />
        <span className={timerClass}>
          {timer?.formatted || "--:--"}
        </span>
        <span className="exam-toolbar__deadline">Ends {deadlineLabel}</span>
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