// src/components/exam/ViolationModal.jsx
import { AlertTriangle, XCircle } from "lucide-react";
import Button from "../ui/Button.jsx";
import "./ViolationModal.css";

const TYPE_LABELS = {
  tab_hidden: "Switching tabs or minimizing the window is not allowed.",
  window_blur: "Clicking outside the exam window is not allowed.",
  fullscreen_exit: "Exiting fullscreen is not allowed and ends the exam.",
  copy: "Copying from the exam is not allowed.",
  paste: "Pasting into the exam is not allowed.",
  cut: "Cutting from the exam is not allowed.",
  context_menu: "Right-clicking is not allowed.",
  print_screen: "Screenshot attempts are not allowed.",
  screenshot_shortcut: "Screenshot shortcuts are not allowed.",
};

export default function ViolationModal({
  open,
  mode,
  violation,
  onDismiss,
  onGoToProfile,
  pending = false,
}) {
  if (!open || !violation) return null;

  const isTerminated = mode === "terminated";
  const remaining = Math.max(0, 2 - violation.count);
  const description =
    TYPE_LABELS[violation.type] || "A proctoring rule was broken.";

  return (
    <div className="violation-modal-backdrop" role="dialog" aria-modal="true">
      <div className={`violation-modal violation-modal--${mode}`}>
        <div className="violation-modal__icon">
          {isTerminated ? <XCircle size={32} /> : <AlertTriangle size={32} />}
        </div>

        <h2 className="violation-modal__title">
          {isTerminated ? "Exam terminated" : "Warning"}
        </h2>

        <p className="violation-modal__desc">{description}</p>

        {isTerminated ? (
          <p className="violation-modal__note">
            Your exam has been terminated. Your drafts have been saved. You'll
            be returned to your profile.
          </p>
        ) : (
          <p className="violation-modal__note">
            <strong>
              {remaining} warning{remaining === 1 ? "" : "s"} remaining.
            </strong>{" "}
            A second violation ends the exam immediately.
          </p>
        )}

        <div className="violation-modal__actions">
          {isTerminated ? (
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={onGoToProfile}
              loading={pending}
            >
              {pending ? "Ending session…" : "Return to profile"}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onDismiss}
            >
              I understand<br></br><br></br> continue the exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}