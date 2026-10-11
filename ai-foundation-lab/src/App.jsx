// src/App.jsx
import { Rocket, Sparkles, Zap, ArrowRight } from "lucide-react";
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import PillTab from "./components/ui/PillTab.jsx";
import {
  Reveal,
  Stagger,
  StaggerItem,
  Floating,
  GlowPulse,
} from "./components/ui/motion.js";
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
          paddingBottom: "var(--space-10)",
        }}
      >
        {/* ---------- Reveal — every scroll into view ---------- */}
        <section className="section">
          <div className="container">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.14 — motion primitives
            </p>
            <Reveal variant="heroReveal">
              <h2
                className="type-h2"
                style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}
              >
                Motion, intentionally
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.15}>
              <p className="type-body" style={{ maxWidth: "60ch" }}>
                Every animation in this app comes from this library. Scroll
                down — each section reveals as it enters the viewport. Toggle
                reduced motion in your OS to see everything render instantly.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Reveal variants ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal variant="fadeUp">
              <h3
                className="type-h3"
                style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
              >
                Reveal variants
              </h3>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                gap: "var(--space-4)",
              }}
            >
              <Reveal variant="fadeUp">
                <Card variant="glass" size="md">
                  <span className="type-label" style={{ color: "var(--pink-400)" }}>
                    fadeUp
                  </span>
                  <p className="type-body-sm" style={{ marginTop: "var(--space-2)" }}>
                    Default scroll reveal. Small upward shift + fade.
                  </p>
                </Card>
              </Reveal>

              <Reveal variant="scaleIn" delay={0.1}>
                <Card variant="glass" size="md">
                  <span className="type-label" style={{ color: "var(--cyan-400)" }}>
                    scaleIn
                  </span>
                  <p className="type-body-sm" style={{ marginTop: "var(--space-2)" }}>
                    Scales from 96% to 100%. Feels weighty, deliberate.
                  </p>
                </Card>
              </Reveal>

              <Reveal variant="slideInLeft" delay={0.2}>
                <Card variant="glass" size="md">
                  <span className="type-label" style={{ color: "var(--orange-500)" }}>
                    slideInLeft
                  </span>
                  <p className="type-body-sm" style={{ marginTop: "var(--space-2)" }}>
                    Enters from the left. Used for the hero founder blob.
                  </p>
                </Card>
              </Reveal>

              <Reveal variant="slideInRight" delay={0.3}>
                <Card variant="glass" size="md">
                  <span className="type-label" style={{ color: "var(--violet-600)" }}>
                    slideInRight
                  </span>
                  <p className="type-body-sm" style={{ marginTop: "var(--space-2)" }}>
                    Enters from the right. Used for the hero wordmark.
                  </p>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Stagger ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal variant="fadeUp">
              <h3
                className="type-h3"
                style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
              >
                Stagger — the 8-step timeline pattern
              </h3>
            </Reveal>

            <Stagger
              staggerDelay={0.08}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {[
                "Register",
                "Verify email",
                "Admin approval",
                "Photo check",
                "Join Telegram",
                "Identity confirm",
                "Take exam",
                "See results",
              ].map((label, i) => (
                <StaggerItem key={label}>
                  <Card variant="glass" size="sm">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <span
                        className="type-label"
                        style={{ color: "var(--pink-400)", minWidth: 20 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="type-body-sm" style={{ color: "var(--white)" }}>
                        {label}
                      </span>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ---------- Floating ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal variant="fadeUp">
              <h3
                className="type-h3"
                style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
              >
                Floating — hero rocket &amp; accents
              </h3>
            </Reveal>

            <div
              style={{
                display: "flex",
                gap: "var(--space-7)",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Floating amplitude={10} duration={4}>
                <Rocket
                  size={48}
                  className="icon-gradient"
                  aria-hidden="true"
                />
              </Floating>

              <Floating amplitude={6} duration={3} delay={0.3}>
                <Sparkles
                  size={32}
                  className="icon-gradient-cyan"
                  aria-hidden="true"
                />
              </Floating>

              <Floating amplitude={8} duration={5} delay={0.6}>
                <Zap
                  size={28}
                  className="icon-gradient"
                  aria-hidden="true"
                />
              </Floating>

              <p className="type-body-sm" style={{ maxWidth: "32ch" }}>
                Each floats at a slightly different amplitude and duration so
                they feel organic rather than synchronized.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- GlowPulse ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal variant="fadeUp">
              <h3
                className="type-h3"
                style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
              >
                GlowPulse — hero CTAs
              </h3>
            </Reveal>

            <div
              style={{
                display: "flex",
                gap: "var(--space-5)",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <GlowPulse color="rgba(255, 63, 164, 0.55)">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Register
                </Button>
              </GlowPulse>

              <GlowPulse
                color="rgba(46, 200, 255, 0.55)"
                duration={2.0}
                scale
              >
                <Button variant="secondary" size="lg">
                  Take the exam
                </Button>
              </GlowPulse>

              <p className="type-body-sm" style={{ maxWidth: "32ch" }}>
                The pink pulse is the primary. The cyan pulse has a subtle
                scale bounce for emphasis.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Full composition preview ---------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal variant="fadeUp">
              <h3
                className="type-h3"
                style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
              >
                Composed — how Phase 2 will feel
              </h3>
            </Reveal>

            <Card variant="gradient" size="lg">
              <Stagger staggerDelay={0.1}>
                <StaggerItem>
                  <PillTab variant="secondary" size="sm">
                    Coming soon
                  </PillTab>
                </StaggerItem>
                <StaggerItem>
                  <h4
                    className="type-h2"
                    style={{
                      color: "var(--white)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    Ai Foundation Lab
                  </h4>
                </StaggerItem>
                <StaggerItem>
                  <p
                    className="type-body-lg"
                    style={{ color: "var(--white)", marginTop: "var(--space-3)" }}
                  >
                    A guild for programming-proficient students to build and
                    apply AI within their own academic disciplines.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <div style={{ marginTop: "var(--space-5)" }}>
                    <Floating amplitude={4} duration={3}>
                      <GlowPulse color="rgba(46, 200, 255, 0.6)">
                        <Button
                          variant="secondary"
                          size="lg"
                          rightIcon={<ArrowRight size={18} />}
                        >
                          Register
                        </Button>
                      </GlowPulse>
                    </Floating>
                  </div>
                </StaggerItem>
              </Stagger>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}