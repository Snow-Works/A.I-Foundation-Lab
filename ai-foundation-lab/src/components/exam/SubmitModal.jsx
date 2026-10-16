// src/components/exam/SubmitModal.jsx
import { Send, AlertTriangle } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./SubmitModal.css";

export default function SubmitModal({
  open,
  answeredCount,
  totalCount,
  onCancel,
  onConfirm,
  pending = false,
  error = "",
}) {
  if (!open) return null;

  const unanswered = Math.max(0, totalCount - answeredCount);

  return (
    <div
      className="submit-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="submit-modal">
        <div className="submit-modal__icon">
          <Send size={28} />
        </div>

        <h2 id="submit-modal-title" className="submit-modal__title">
          Submit your exam?
        </h2>

        <p className="submit-modal__desc">
          You've answered <strong>{answeredCount}</strong> of{" "}
          <strong>{totalCount}</strong> questions.
        </p>

        {unanswered > 0 && (
          <p className="submit-modal__warn">
            <AlertTriangle size={14} aria-hidden="true" />
            {unanswered} question{unanswered === 1 ? "" : "s"} unanswered.
          </p>
        )}

        <p className="submit-modal__note">
          Once submitted, your answers are final and cannot be changed.
        </p>

        {error && (
          <p className="submit-modal__error" role="alert">
            {error}
          </p>
        )}

        <div className="submit-modal__actions">
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onCancel}
            disabled={pending}
          >
            Keep working
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onConfirm}
            loading={pending}
          >
            {pending ? "Submitting…" : "Submit now"}
          </Button>
        </div>
      </div>
    </div>
  );
}