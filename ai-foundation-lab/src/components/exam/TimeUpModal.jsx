// src/components/exam/TimeUpModal.jsx
import { Clock } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./TimeUpModal.css";

export default function TimeUpModal({ open, onGoToProfile, pending = false }) {
  if (!open) return null;

  return (
    <div
      className="time-up-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-up-title"
    >
      <div className="time-up-modal">
        <div className="time-up-modal__icon">
          <Clock size={32} />
        </div>

        <h2 id="time-up-title" className="time-up-modal__title">
          Time's up
        </h2>

        <p className="time-up-modal__desc">
          The exam time has ended. Your answers have been saved to the server.
        </p>

        <p className="time-up-modal__note">
          Submission confirmation arrives in the next build step (5.10). For
          now, you'll be returned to your profile.
        </p>

        <div className="time-up-modal__actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onGoToProfile}
            loading={pending}
          >
            {pending ? "Ending session…" : "Return to profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}