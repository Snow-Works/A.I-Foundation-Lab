// src/pages/ExamSubmitted.jsx
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./ExamSubmitted.css";

export default function ExamSubmitted() {
  const [params] = useSearchParams();
  const reason = params.get("reason"); // "time_up" | "manual"
  const attempted = params.get("attempted");
  const submittedAt = params.get("at");

  const isTimeUp = reason === "time_up";

  return (
    <section className="exam-submitted section">
      <div className="container-narrow exam-submitted__container">
        <Card variant="glass" size="lg" withTab glow="cyan">
          <PillTab floating position="center" variant="cyan">
            Submitted
          </PillTab>

          <div className="exam-submitted__center">
            <div className="exam-submitted__icon">
              <CheckCircle2 size={32} />
            </div>

            <h1
              className="type-h2"
              style={{ color: "var(--white)", margin: 0 }}
            >
              {isTimeUp ? "Time's up — answers saved" : "Answers submitted"}
            </h1>

            <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
              Your answers have been stored securely on our servers.
              {attempted && (
                <>
                  {" "}
                  You answered <strong>{attempted}</strong> questions.
                </>
              )}
            </p>

            {submittedAt && (
              <p className="exam-submitted__meta type-caption">
                Submitted {new Date(submittedAt).toLocaleString()}
              </p>
            )}

            <div className="exam-submitted__status">
              <div className="exam-submitted__status-head">
                <Clock size={16} />
                <span>Under review</span>
              </div>
              <p className="exam-submitted__status-desc">
                AI Foundation Lab team will mark your answers against a rubric. Your
                result is released when marking is complete, and admission will be sent if you passed.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              as={Link}
              to="/profile"
              rightIcon={<ArrowRight size={18} />}
            >
              Back to profile
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}