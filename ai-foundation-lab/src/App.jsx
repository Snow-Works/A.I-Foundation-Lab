// src/App.jsx
import { useState } from "react";
import Card from "./components/ui/Card.jsx";
import PillTab from "./components/ui/PillTab.jsx";
import Button from "./components/ui/Button.jsx";
import ProgressTracker, {
  ProgressTrackerCompact,
  TRACKER_STEPS,
} from "./components/ui/ProgressTracker.jsx";
import { GradientDefs } from "./components/ui/icons";

export default function App() {
  const [index, setIndex] = useState(4); // COMMUNTY_UNLOCKED

  const currentState = TRACKER_STEPS[index].key;

  const advance = () =>
    setIndex((i) => Math.min(i + 1, TRACKER_STEPS.length - 1));
  const reset = () => setIndex(0);
  const setError = () => setIndex(1); // Email verified stuck

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
        {/* --- Interactive demo --- */}
        <section className="section">
          <div className="container">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.13 — progress tracker
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}
            >
              Current state: <span className="type-gradient">{currentState}</span>
            </h2>
            <p className="type-body" style={{ marginBottom: "var(--space-6)" }}>
              Below is the state machine from the spec, rendered as a
              progressive tracker. Click the buttons to move the student
              through the states.
            </p>

            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                flexWrap: "wrap",
                marginBottom: "var(--space-7)",
              }}
            >
              <Button onClick={advance} disabled={index === TRACKER_STEPS.length - 1}>
                Advance
              </Button>
              <Button variant="secondary" onClick={setError}>
                Simulate error at Email
              </Button>
              <Button variant="ghost" onClick={reset}>
                Reset to Registered
              </Button>
            </div>

            <Card variant="glass" size="lg">
              <ProgressTracker
                currentState={currentState}
                overrides={index === 1 ? { EMAIL_VERIFIED: "error" } : {}}
              />
            </Card>
          </div>
        </section>

        {/* --- Vertical variant --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Vertical orientation
            </h2>

            <Card variant="glass" size="lg" style={{ maxWidth: 560 }}>
              <ProgressTracker
                currentState={currentState}
                orientation="vertical"
              />
            </Card>
          </div>
        </section>

        {/* --- Compact variant --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Compact — for profile header
            </h2>

            <Card variant="glass" size="md" withTab>
              <PillTab floating position="center" variant="default">
                Your progress
              </PillTab>
              <ProgressTrackerCompact currentState={currentState} />
            </Card>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}