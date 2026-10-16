// src/pages/ExamSession.jsx
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./ExamSession.css";

export default function ExamSession() {
  const location = useLocation();
  const params = useParams();
  const attemptId = params.attemptId;

  const state = location.state;
  const attempt = state?.attempt;
  const questions = state?.questions;

  // Fullscreen request on mount — keeps the session going if the user reloads
  useEffect(() => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  if (!attempt || !questions) {
    return (
      <section className="exam-session section">
        <div className="container-narrow">
          <Card variant="glass" size="lg" withTab tone="danger">
            <PillTab floating position="center" variant="default">
              No session
            </PillTab>
            <div className="exam-session__center">
              <div className="exam-session__icon exam-session__icon--error">
                <AlertCircle size={28} />
              </div>
              <h1
                className="type-h3"
                style={{ color: "var(--white)", margin: 0 }}
              >
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

  return (
    <section className="exam-session section">
      <div className="container-narrow">
        <Card variant="glass" size="lg" withTab glow="cyan">
          <PillTab floating position="center" variant="cyan">
            Session active
          </PillTab>

          <div className="exam-session__center">
            <div className="exam-session__icon exam-session__icon--success">
              <CheckCircle2 size={28} />
            </div>
            <h1
              className="type-h3"
              style={{ color: "var(--white)", margin: 0 }}
            >
              Your exam has started
            </h1>
            <p className="type-body" style={{ maxWidth: "48ch", margin: 0 }}>
              {questions.length} questions assigned at random from the bank.
              The code editor arrives in the next build step.
            </p>
          </div>

          <div className="exam-session__meta">
            <div className="exam-session__meta-row">
              <span className="exam-session__meta-label">Attempt ID</span>
              <code className="exam-session__meta-value">{attempt.id}</code>
            </div>
            <div className="exam-session__meta-row">
              <span className="exam-session__meta-label">
                <Clock size={12} /> Started
              </span>
              <span className="exam-session__meta-value">
                {new Date(attempt.started_at).toLocaleString()}
              </span>
            </div>
            <div className="exam-session__meta-row">
              <span className="exam-session__meta-label">
                <Clock size={12} /> Deadline
              </span>
              <span className="exam-session__meta-value">
                {new Date(attempt.deadline_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="exam-session__questions">
            <h2 className="exam-intro__section-title">
              Assigned questions
            </h2>
            <ol className="exam-session__list">
              {questions.map((q) => (
                <li key={q.id}>
                  <span className="exam-session__qtitle">{q.title}</span>
                  <span className="exam-session__qmeta">
                    {q.difficulty}
                    {q.topic ? ` · ${q.topic}` : ""}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: "var(--space-6)" }}>
            <Button variant="secondary" size="lg" fullWidth as={Link} to="/profile">
              Back to profile
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}