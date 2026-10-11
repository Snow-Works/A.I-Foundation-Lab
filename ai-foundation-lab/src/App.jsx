// src/App.jsx
import { useState, useRef } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Trash2,
  Camera,
} from "lucide-react";
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import PillTab from "./components/ui/PillTab.jsx";
import Modal from "./components/ui/Modal.jsx";
import AlertModal from "./components/ui/AlertModal.jsx";
import { GradientDefs } from "./components/ui/icons";

export default function App() {
  const [violationOpen, setViolationOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirmBtnRef = useRef(null);

  const handleSimulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmOpen(false);
      setSuccessOpen(true);
    }, 1600);
  };

  return (
    <>
      <GradientDefs />
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "100dvh",
          color: "var(--white)",
        }}
      >
        <section className="section">
          <div className="container">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.12 — modal &amp; alert dialog
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-7)" }}
            >
              Try each modal
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <Card variant="glass" size="md" hoverable>
                <PillTab variant="primary" size="sm">Warning</PillTab>
                <p className="type-body" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  Exam violation alert — mimics the flow we'll use in the
                  proctored exam module.
                </p>
                <Button
                  variant="primary"
                  rightIcon={<ShieldAlert size={16} />}
                  onClick={() => setViolationOpen(true)}
                >
                  Trigger violation
                </Button>
              </Card>

              <Card variant="glass" size="md" hoverable>
                <PillTab variant="default" size="sm">Confirmation</PillTab>
                <p className="type-body" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  Destructive-action dialog with initial focus on the cancel
                  button.
                </p>
                <Button
                  variant="danger"
                  leftIcon={<Trash2 size={16} />}
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete something
                </Button>
              </Card>

              <Card variant="glass" size="md" hoverable>
                <PillTab variant="cyan" size="sm">Success</PillTab>
                <p className="type-body" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  Positive confirmation — for exam submission, photo upload,
                  identity confirmed.
                </p>
                <Button
                  variant="secondary"
                  leftIcon={<CheckCircle2 size={16} />}
                  onClick={() => setSuccessOpen(true)}
                >
                  Show success
                </Button>
              </Card>

              <Card variant="glass" size="md" hoverable>
                <PillTab variant="silver" size="sm">Large</PillTab>
                <p className="type-body" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  Large modal for photo preview, admin marking, or long-form
                  content.
                </p>
                <Button
                  variant="ghost"
                  leftIcon={<Camera size={16} />}
                  onClick={() => setPhotoOpen(true)}
                >
                  Preview photo
                </Button>
              </Card>
            </div>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>

      {/* ---------- EXAM VIOLATION WARNING ---------- */}
      <AlertModal
        open={violationOpen}
        onClose={() => setViolationOpen(false)}
        tone="warning"
        title="Exam ended — a violation was detected"
        description="Switching tabs, exiting fullscreen, or attempting to copy during the exam is not allowed. This attempt has been recorded. You have 1 attempt remaining."
        confirmLabel="I understand"
        cancelLabel="Retake now"
        onConfirm={() => setViolationOpen(false)}
        showCancel
        closeOnBackdrop={false}
        closeOnEsc={false}
      >
        <Card variant="outline" size="sm">
          <span className="type-label" style={{ color: "var(--orange-500)" }}>
            Violation details
          </span>
          <ul
            style={{
              marginTop: "var(--space-2)",
              listStyle: "disc",
              paddingLeft: "1.25rem",
              color: "var(--silver)",
            }}
          >
            <li className="type-body-sm">Type: Tab hidden</li>
            <li className="type-body-sm">Time: 2026-10-11 14:32:07</li>
            <li className="type-body-sm">Attempt: 1 of 2</li>
          </ul>
        </Card>
      </AlertModal>

      {/* ---------- DESTRUCTIVE CONFIRMATION ---------- */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this question?"
        subtitle="This action cannot be undone."
        tone="danger"
        size="sm"
        icon={<AlertTriangle size={22} />}
        initialFocusRef={confirmBtnRef}
        footer={
          <>
            <Button
              variant="ghost"
              ref={confirmBtnRef}
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={loading}
              onClick={handleSimulateLoading}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <p>
          Deleting this question will remove it from the question bank and
          will not affect any submitted exam that already used it.
        </p>
      </Modal>

      {/* ---------- SUCCESS ---------- */}
      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        tone="success"
        size="sm"
        icon={<CheckCircle2 size={22} />}
        title="Answers submitted"
        footer={
          <>
            <Button
              variant="primary"
              onClick={() => setSuccessOpen(false)}
            >
              Back to profile
            </Button>
          </>
        }
      >
        <p>
          Your answers have been stored securely. Results will show as
          &ldquo;Under review&rdquo; until an admin marks and releases them.
        </p>
      </Modal>

      {/* ---------- LARGE / PHOTO PREVIEW ---------- */}
      <Modal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        title="Photo verification"
        subtitle="Make sure your face is clearly visible."
        icon={<Camera size={22} />}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPhotoOpen(false)}>
              Retake
            </Button>
            <Button variant="primary" onClick={() => setPhotoOpen(false)}>
              Use this photo
            </Button>
          </>
        }
      >
        <div
          style={{
            aspectRatio: "1 / 1",
            maxWidth: 320,
            margin: "0 auto",
            borderRadius: "var(--radius-lg)",
            background: "var(--gradient-signature)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
            <Sparkles
              size={40}
              className="icon-gradient"
              style={{ margin: "0 auto var(--space-3)" }}
            />
            <p className="type-body-sm" style={{ color: "var(--white)" }}>
              Photo placeholder
            </p>
            <p className="type-caption" style={{ marginTop: "var(--space-1)" }}>
              In Phase 4 we&apos;ll render the captured or uploaded image here.
            </p>
          </div>
        </div>

        <p className="type-body" style={{ marginTop: "var(--space-4)" }}>
          This is a best-effort check for a single, clearly visible human
          face. It does not verify identity — an admin will review your photo
          if auto-detection fails.
        </p>
      </Modal>
    </>
  );
}