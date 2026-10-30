// src/pages/ExamIntro.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  ListChecks,
  Repeat,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { startExam, abandonExam } from "../services/examService.js";
import pb from "../lib/pocketbase";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import AlertModal from "../components/ui/AlertModal.jsx";
import "./ExamIntro.css";

export default function ExamIntro() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  // Existing active attempt state
  const [activeAttemptId, setActiveAttemptId] = useState(null);
  const [resetsRemaining, setResetsRemaining] = useState(3);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Synchronous guards — prevent double-click / rapid-Enter double-submits
  const startingRef = useRef(false);
  const resettingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const m = await pb.send("/api/exam/meta", { method: "GET" });
        if (!cancelled) setMeta(m);
      } catch (err) {
        console.error("[exam-intro] meta load error:", err);
        if (!cancelled) {
          // Fall back to safe defaults; the page stays usable.
          setMeta({
            question_count: 25,
            duration_minutes: 105,
            attempt_limit: 2,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep track of resets (defaulting to 3 if null)
  useEffect(() => {
    if (user) {
      setResetsRemaining(user.resets_remaining ?? 3);
    }
  }, [user]);

  const durationMinutes = meta?.duration_minutes ?? 105;
  const attemptLimit = meta?.attempt_limit ?? 2;
  const questionCount = meta?.question_count ?? 25;
  const attemptsRemaining = user?.attempts_remaining ?? 0;

  const handleBegin = async () => {
    if (startingRef.current) return;
    startingRef.current = true;

    setError("");
    setStarting(true);
    setActiveAttemptId(null);

    try {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen && !document.fullscreenElement) {
          await el.requestFullscreen();
        }
      } catch (err) {
        console.warn("[exam-intro] fullscreen request failed:", err);
      }

      try {
        const result = await startExam();
        navigate(`/exam/session/${result.attempt.id}`, {
          replace: true,
          state: result,
        });
      } catch (err) {
        console.error("[exam-intro] start exam error:", err);

        if (err?.status === 409) {
          const attemptId =
            err?.response?.data?.attemptId || err?.response?.attemptId;
          if (attemptId) {
            setActiveAttemptId(attemptId);
            setError(
              "You have an exam session currently in progress. You can resume it, or abandon it to start fresh."
            );
            return;
          }
        }

        const pbData = err?.response?.data || {};
        setError(
          pbData.message ||
            err?.response?.message ||
            err?.message ||
            "We couldn't start the exam. Please try again."
        );
      }
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  };

  const handleResume = () => {
    if (activeAttemptId) {
      navigate(`/exam/session/${activeAttemptId}`, { replace: true });
    }
  };

  const handleAbandon = async () => {
    if (resettingRef.current) return;
    resettingRef.current = true;

    setResetting(true);

    try {
      await abandonExam();
      await refresh();
      setShowResetModal(false);
      setActiveAttemptId(null);
      setError("");
      handleBegin();
    } catch (err) {
      console.error("[exam-intro] abandon error:", err);
      setError(err?.response?.message || "Failed to reset exam.");
      setShowResetModal(false);
    } finally {
      resettingRef.current = false;
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <section className="exam-intro section">
        <div className="container-narrow">
          <Card variant="glass" size="lg">
            <div className="exam-intro__center">
              <Loader2 size={28} className="exam-intro__spinner" />
              <p className="type-body" style={{ margin: 0 }}>
                Loading exam details…
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="exam-intro section">
      <div className="container-narrow exam-intro__container">
        <Link to="/profile" className="exam-intro__back">
          ← Back to profile
        </Link>

        <Card variant="glass" size="lg" withTab glow="pink">
          <PillTab floating position="center" variant="primary">
            Exam
          </PillTab>

          <header className="exam-intro__header">
            <div className="exam-intro__icon">
              <ShieldCheck size={30} />
            </div>
            <h1 className="type-h2 exam-intro__title">Python coding exam</h1>
            <p className="type-body exam-intro__subtitle">
              Read everything on this page before you begin. Once the exam
              starts, the timer runs and the session is monitored.
            </p>
          </header>

          <div className="exam-intro__stats">
            <div className="exam-intro__stat">
              <Clock size={16} />
              <div>
                <span className="exam-intro__stat-label">Duration</span>
                <span className="exam-intro__stat-value">
                  {durationMinutes} minutes
                </span>
              </div>
            </div>
            <div className="exam-intro__stat">
              <ListChecks size={16} />
              <div>
                <span className="exam-intro__stat-label">Questions</span>
                <span className="exam-intro__stat-value">
                  {questionCount} coding problems
                </span>
              </div>
            </div>
            <div className="exam-intro__stat">
              <Repeat size={16} />
              <div>
                <span className="exam-intro__stat-label">Attempts</span>
                <span className="exam-intro__stat-value">
                  {attemptsRemaining} of {attemptLimit} remaining
                </span>
              </div>
            </div>
          </div>

          <div className="exam-intro__section">
            <h2 className="exam-intro__section-title">Instructions</h2>
            <ol className="exam-intro__list">
              <li>
                You'll see one question at a time. Use the question list to jump
                between them. Your answers are saved automatically every 15
                seconds.
              </li>
              <li>
                Write your Python solution in the editor. You can click "Run
                Code" to test your code against basic inputs before submitting.
              </li>
              <li>
                You can submit at any time. Once submitted, your answers are
                final. If time runs out, the exam submits automatically.
              </li>
              <li>
                Answers are marked by a human admin. You'll see "Under review"
                until your result is released.
              </li>
            </ol>
          </div>

          <div className="exam-intro__warning">
            <div className="exam-intro__warning-head">
              <AlertTriangle size={16} />
              <span>Proctoring is active during this exam</span>
            </div>
            <ul className="exam-intro__warning-list">
              <li>
                The exam runs in fullscreen. Exiting fullscreen ends the exam
                immediately.
              </li>
              <li>
                Switching tabs, minimizing, or losing focus triggers a warning.
                Two warnings terminate the exam.
              </li>
              <li>
                Copying, pasting, and right-click are disabled. Attempts are
                logged.
              </li>
              <li>
                Screenshots are not allowed. Every screen you see carries a
                visible watermark traceable to your account.
              </li>
            </ul>
          </div>

          {error && (
            <div className="exam-intro__error" role="alert">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="exam-intro__actions">
            {activeAttemptId ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleResume}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Resume Active Exam
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowResetModal(true)}
                  disabled={resetsRemaining <= 0}
                  leftIcon={<RotateCcw size={16} />}
                >
                  {resetsRemaining > 0
                    ? `Abandon & Start Fresh (${resetsRemaining} resets left)`
                    : "No resets remaining"}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleBegin}
                loading={starting}
                rightIcon={!starting && <ArrowRight size={18} />}
              >
                {starting ? "Preparing…" : "Begin exam"}
              </Button>
            )}

            <p className="exam-intro__hint">
              <Maximize2 size={12} aria-hidden="true" />
              Fullscreen mode is required. Click Begin to enter fullscreen.
            </p>
          </div>
        </Card>
      </div>

      <AlertModal
        open={showResetModal}
        onClose={() => !resetting && setShowResetModal(false)}
        tone="danger"
        title="Abandon current exam?"
        description="This will permanently delete your current progress. You will be given a fresh exam with a new set of questions and a brand new timer. This will consume 1 of your allowed resets."
        confirmLabel={
          resetting ? "Resetting…" : "Yes, abandon and start fresh"
        }
        onConfirm={handleAbandon}
        loading={resetting}
        showCancel
        closeOnBackdrop={!resetting}
        closeOnEsc={!resetting}
      />
    </section>
  );
}