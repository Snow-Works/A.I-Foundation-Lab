// src/App.jsx
import { Sparkles, ShieldCheck, Eye, Award } from "lucide-react";
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import PillTab from "./components/ui/PillTab.jsx";
import { GradientDefs } from "./components/ui/icons";

export default function App() {
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
        {/* --- Variants --- */}
        <section className="section">
          <div className="container">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.10 — pill tab component
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Four variants
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <PillTab variant="default">Default</PillTab>
              <PillTab variant="primary">Primary</PillTab>
              <PillTab variant="cyan">Cyan</PillTab>
              <PillTab variant="silver">Silver</PillTab>
            </div>
          </div>
        </section>

        {/* --- Sizes --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Three sizes
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <PillTab size="sm">Small</PillTab>
              <PillTab size="md">Medium</PillTab>
              <PillTab size="lg">Large</PillTab>
            </div>
          </div>
        </section>

        {/* --- With icons --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              With icons
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <PillTab variant="default" icon={<Sparkles size={12} />}>
                Mission
              </PillTab>
              <PillTab variant="cyan" icon={<Eye size={12} />}>
                Vision
              </PillTab>
              <PillTab variant="primary" icon={<Award size={12} />}>
                Exam
              </PillTab>
              <PillTab variant="silver" icon={<ShieldCheck size={12} />}>
                Verified
              </PillTab>
            </div>
          </div>
        </section>

        {/* --- Overlap: the poster pattern --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-7)" }}
            >
              Overlapping cards — the poster pattern
            </h2>

            <div style={{ display: "grid", gap: "var(--space-7)" }}>
              <Card variant="glass" size="md" withTab glow="pink">
                <PillTab floating position="center" variant="default">
                  Mission
                </PillTab>
                <p className="type-body">
                  To give students who are already proficient in programming a
                  guild through which to build and apply artificial intelligence
                  to their academic fields of study, and to use it as a practical
                  tool for solving real problems within those fields.
                </p>
              </Card>

              <Card variant="glass" size="md" withTab glow="cyan">
                <PillTab floating position="center" variant="default">
                  Vision
                </PillTab>
                <p className="type-body">
                  To build a community of students who can build and apply
                  artificial intelligence to their respective academic fields.
                </p>
              </Card>

              <Card variant="glass" size="md" withTab glow="orange" accent="orange">
                <PillTab floating position="center" variant="default">
                  Who is the lab for?
                </PillTab>
                <p className="type-body">
                  The AI Foundation Lab is <strong>not</strong> an entry point
                  for beginners. It is a guild for students who already have
                  working programming ability and are looking for a structured
                  opportunity to direct that skill towards building and applying
                  AI within their own academic discipline.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Position variants --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-7)" }}
            >
              Position — left, center, right
            </h2>

            <div style={{ display: "grid", gap: "var(--space-7)" }}>
              <Card variant="glass" withTab>
                <PillTab floating position="left" variant="primary">
                  Left
                </PillTab>
                <p className="type-body">
                  Pill anchored to the left edge of the card.
                </p>
              </Card>

              <Card variant="glass" withTab>
                <PillTab floating position="center" variant="primary">
                  Center
                </PillTab>
                <p className="type-body">
                  Pill centered — the poster's default treatment.
                </p>
              </Card>

              <Card variant="glass" withTab>
                <PillTab floating position="right" variant="primary">
                  Right
                </PillTab>
                <p className="type-body">
                  Pill anchored to the right edge of the card.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Interactive pills (badges) --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Interactive pills — status badges
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <PillTab variant="silver" interactive onClick={() => alert("Registered")}>
                Registered
              </PillTab>
              <PillTab variant="default" interactive onClick={() => alert("Email verified")}>
                Email verified
              </PillTab>
              <PillTab variant="cyan" interactive onClick={() => alert("Approved")}>
                Approved
              </PillTab>
              <PillTab variant="primary" interactive onClick={() => alert("Exam unlocked")}>
                Exam unlocked
              </PillTab>
            </div>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}