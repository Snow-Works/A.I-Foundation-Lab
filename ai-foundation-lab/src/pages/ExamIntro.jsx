// src/pages/ExamIntro.jsx
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAppSettings } from "../services/settingsService.js";
import { startExam } from "../services/examService.js";
import pb from "../lib/pocketbase";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./ExamIntro.css";

export default function ExamIntro() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [settings, setSettings] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Load settings
      try {
        const s = await getAppSettings({ force: true });
        if (!cancelled) setSettings(s);
      } catch (err) {
        console.error("[exam-intro] settings load error:", err);
      }

      // Load active blueprint for question count
      try {
        const bp = await pb
          .collection("exam_blueprints")
          .getFirstListItem("is_active = true");
        const total =
          (bp.easy_count || 0) +
          (bp.medium_count || 0) +
          (bp.hard_count || 0);
        if (!cancelled) setQuestionCount(total || 15);
      } catch (err) {
        console.warn("[exam-intro] blueprint load failed, defaulting to 15");
        if (!cancelled) setQuestionCount(15);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const durationMinutes = settings?.exam_duration_minutes || 105;
  const attemptsRemaining = user?.attempts_remaining ?? 0;
  const attemptLimit = settings?.attempt_limit || 2;

  const handleBegin = async () => {
    setError("");
    setStarting(true);

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
        const pbData = err?.response?.data || err?.response || {};
        const attemptId = pbData.attemptId;
        if (attemptId) {
          setError(
            "You already have an exam in progress. Please wait for the current attempt to finish or contact an admin."
          );
          setStarting(false);
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
      setStarting(false);
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
                You'll see one question at a time. Use the question list to
                jump between them. Your answers are saved automatically every
                15 seconds.
              </li>
              <li>
                Write your Python solution in the editor for each question.
                The editor is a proper code editor with syntax highlighting.
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
                A moving watermark with your email and timestamp overlays the
                screen at all times.
              </li>
            </ul>
            <p className="exam-intro__warning-note">
              Browsers cannot block OS-level screenshots or external recorders.
              We log what we can detect. You are trusted to act with integrity.
            </p>
          </div>

          {error && (
            <div className="exam-intro__error" role="alert">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="exam-intro__actions">
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
            <p className="exam-intro__hint">
              <Maximize2 size={12} aria-hidden="true" />
              Fullscreen mode is required. Click Begin to enter fullscreen.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}