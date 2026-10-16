// src/pages/ExamSession.jsx
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { resumeExam } from "../services/examService.js";
import { useAutosave } from "../hooks/useAutosave.js";
import { useProctoring } from "../hooks/useProctoring.js";
import { useExamTimer } from "../hooks/useExamTimer.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import ExamToolbar from "../components/exam/ExamToolbar.jsx";
import QuestionNav from "../components/exam/QuestionNav.jsx";
import QuestionPanel from "../components/exam/QuestionPanel.jsx";
import ViolationModal from "../components/exam/ViolationModal.jsx";
import TimeUpModal from "../components/exam/TimeUpModal.jsx";
import ExamWatermark from "../components/exam/ExamWatermark.jsx";
import "./ExamSession.css";

export default function ExamSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();

  const attemptIdFromUrl = params.attemptId;
  const initialAttempt = location.state?.attempt || null;
  const initialQuestions = location.state?.questions || null;
  const initialDrafts = location.state?.drafts || [];

  const [attempt, setAttempt] = useState(initialAttempt);
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const map = {};
    for (const d of initialDrafts) map[d.questionId] = d.body;
    return map;
  });
  const [answerIds, setAnswerIds] = useState(() => {
    const map = {};
    for (const d of initialDrafts) map[d.questionId] = d.answerId;
    return map;
  });
  const [loading, setLoading] = useState(!initialAttempt);
  const [error, setError] = useState("");

  const [violation, setViolation] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [terminating, setTerminating] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  /* ---------- Resume on mount if no state came from the router ---------- */
  useEffect(() => {
    if (initialAttempt && initialQuestions) return;
    if (!attemptIdFromUrl) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await resumeExam();
        if (cancelled) return;
        setAttempt(data.attempt);
        setQuestions(data.questions);
        const ansMap = {};
        const idsMap = {};
        for (const d of data.drafts || []) {
          ansMap[d.questionId] = d.body;
          idsMap[d.questionId] = d.answerId;
        }
        setAnswers(ansMap);
        setAnswerIds(idsMap);
      } catch (err) {
        if (cancelled) return;
        console.error("[exam-session] resume error:", err);
        setError(err?.response?.message || "Could not load your exam session.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Autosave ---------- */
  const { saveStatus, flushNow } = useAutosave({
    attemptId: attempt?.id,
    studentId: user?.id,
    answers,
    answerIds,
    setAnswerIds,
  });

  /* ---------- Timer expiry ---------- */
  const handleTimeUp = useCallback(async () => {
    setTimeUp(true);
    // Persist any pending edits
    try {
      await flushNow(true);
    } catch (err) {
      console.error("[exam-session] time-up flush failed:", err);
    }
    // Exit fullscreen
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (_) {}
  }, [flushNow]);

  const timer = useExamTimer({
    deadlineAt: attempt?.deadline_at,
    onExpire: handleTimeUp,
    enabled: !!attempt && !modalMode && !timeUp,
  });

  /* ---------- Violation handlers ---------- */
  const handleWarning = useCallback((v) => {
    setViolation(v);
    setModalMode("warning");
  }, []);

  const handleTerminate = useCallback(
    async (v) => {
      setViolation(v);
      setModalMode("terminated");
      try {
        await flushNow(true);
      } catch (err) {
        console.error("[exam-session] final save failed:", err);
      }
    },
    [flushNow]
  );

  const { report } = useProctoring({
    attemptId: attempt?.id,
    enabled: !!attempt && !modalMode && !timeUp,
    onWarning: handleWarning,
    onTerminate: handleTerminate,
  });

  /* ---------- Fullscreen on mount ---------- */
  useEffect(() => {
    if (!attempt) return;
    if (
      document.documentElement.requestFullscreen &&
      !document.fullscreenElement
    ) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [attempt]);

  /* ---------- Handlers ---------- */
  const dismissWarning = () => {
    setModalMode(null);
    if (
      document.documentElement.requestFullscreen &&
      !document.fullscreenElement
    ) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const goToProfile = async () => {
    setTerminating(true);
    try {
      await flushNow(true);
    } catch (_) {}
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (_) {}
    navigate("/profile?terminated=1", { replace: true });
  };

  const goToProfileAfterTimeUp = async () => {
    setTerminating(true);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (_) {}
    navigate("/profile", { replace: true });
  };

  /* ---------- Render branches ---------- */
  if (loading) {
    return (
      <section className="exam-session-empty section">
        <div className="container-narrow">
          <Card variant="glass" size="lg">
            <div className="exam-session-empty__center">
              <Loader2 size={28} className="exam-session-empty__spinner" />
              <p className="type-body" style={{ margin: 0 }}>
                Loading your exam…
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !attempt || !questions || questions.length === 0) {
    return (
      <section className="exam-session-empty section">
        <div className="container-narrow">
          <Card variant="glass" size="lg" withTab tone="danger">
            <PillTab floating position="center" variant="default">
              No session
            </PillTab>
            <div className="exam-session-empty__center">
              <div className="exam-session-empty__icon">
                <AlertCircle size={28} />
              </div>
              <h1
                className="type-h3"
                style={{ color: "var(--white)", margin: 0 }}
              >
                {error ? "Couldn't load session" : "No active session"}
              </h1>
              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                {error ||
                  "You need to start the exam from the intro screen. If you were in the middle of an attempt, contact an admin."}
              </p>
              <Button variant="primary" size="lg" as={Link} to="/exam/intro">
                Go to exam intro
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const handleJump = (index) => setCurrentIndex(index);

  const handleSubmit = () => {
    alert(
      "Submission arrives in the next build step (5.10). Your answers are saved to the server."
    );
  };

  const answeredCount = Object.values(answers).filter(
    (v) => v && v.trim().length > 0
  ).length;

  return (
    <>
      <div className="exam-session-shell">
        <ExamToolbar
          attempt={attempt}
          answeredCount={answeredCount}
          totalCount={questions.length}
          currentIndex={currentIndex}
          saveStatus={saveStatus}
          timer={timer}
          onSubmit={handleSubmit}
        />

        <div className="exam-session-body">
          <QuestionNav
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onJump={handleJump}
          />

          <main className="exam-session-main">
            {currentQuestion && (
              <QuestionPanel
                key={currentQuestion.id}
                question={currentQuestion}
                index={currentIndex}
                total={questions.length}
                value={answers[currentQuestion.id] || ""}
                onChange={(val) =>
                  handleAnswerChange(currentQuestion.id, val)
                }
              />
            )}

            <div className="exam-session-nav-buttons">
              <Button
                variant="secondary"
                size="lg"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
                Next →
              </Button>
            </div>
          </main>
        </div>
      </div>

      <ExamWatermark email={user?.email || "unknown"} />

      <ViolationModal
        open={modalMode !== null}
        mode={modalMode || "warning"}
        violation={violation}
        onDismiss={dismissWarning}
        onGoToProfile={goToProfile}
        pending={terminating}
      />

      <TimeUpModal
        open={timeUp}
        onGoToProfile={goToProfileAfterTimeUp}
        pending={terminating}
      />
    </>
  );
}