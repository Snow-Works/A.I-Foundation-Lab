// src/components/exam/TimeUpModal.jsx
import { Clock, Loader2 } from "lucide-react";
import "./TimeUpModal.css";

export default function TimeUpModal({ open }) {
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
          The exam time has ended. We're saving your answers now.
        </p>

        <div className="time-up-modal__loading">
          <Loader2 size={20} className="time-up-modal__spinner" />
          <span>Submitting…</span>
        </div>
      </div>
    </div>
  );
}