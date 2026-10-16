// src/pages/ExamSession.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import ExamToolbar from "../components/exam/ExamToolbar.jsx";
import QuestionNav from "../components/exam/QuestionNav.jsx";
import QuestionPanel from "../components/exam/QuestionPanel.jsx";
import "./ExamSession.css";

export default function ExamSession({ location }) {
  // location prop is injected below via the wrapper in App.jsx? No —
  // we use useLocation here for the standard path. Kept flexible.
  return <ExamSessionInner location={location} />;
}

import { useLocation } from "react-router-dom";

function ExamSessionInner() {
  const location = useLocation();
  const attempt = location.state?.attempt;
  const questions = location.state?.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  /* ---------- No session ---------- */
  if (!attempt || !questions || questions.length === 0) {
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
              <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
                No active session found
              </h1>
              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                You need to start the exam from the intro screen. If you were
                in the middle of an attempt, contact an admin.
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

  /* ---------- Handlers ---------- */
  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleJump = (index) => {
    setCurrentIndex(index);
  };

  const handleSubmit = () => {
    alert(
      "Submission arrives in the next build step (5.10). For now, your answers stay in memory."
    );
  };

  const answeredCount = Object.values(answers).filter(
    (v) => v && v.trim().length > 0
  ).length;

  return (
    <div className="exam-session-shell">
      <ExamToolbar
        attempt={attempt}
        answeredCount={answeredCount}
        totalCount={questions.length}
        currentIndex={currentIndex}
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
              onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
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
  );
}