// src/App.jsx
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
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
              Step 1.9 — card component
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Four variants
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <Card variant="glass">
                <span className="type-label" style={{ color: "var(--pink-400)" }}>
                  Glass
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Translucent indigo with backdrop blur and a light inner border.
                  This is the default surface from the poster.
                </p>
              </Card>

              <Card variant="strong">
                <span className="type-label" style={{ color: "var(--cyan-400)" }}>
                  Strong
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Higher-contrast glass with a heavier blur. Used for exam and
                  modal surfaces where content must stay legible.
                </p>
              </Card>

              <Card variant="outline">
                <span className="type-label" style={{ color: "var(--text-secondary)" }}>
                  Outline
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Border only, no fill. Sits quietly over any background.
                </p>
              </Card>

              <Card variant="gradient">
                <span className="type-label" style={{ color: "var(--white)" }}>
                  Gradient
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)", color: "var(--white)" }}>
                  Signature gradient surface. Reserved for hero and final CTAs.
                </p>
              </Card>
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
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <Card size="sm">
                <p className="type-body-sm">Small — tight padding.</p>
              </Card>
              <Card size="md">
                <p className="type-body-sm">Medium — default.</p>
              </Card>
              <Card size="lg">
                <p className="type-body-sm">Large — spacious.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Decorative layers --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Decorative layers
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <Card variant="glass" pattern glow="pink" size="lg">
                <span className="type-label" style={{ color: "var(--pink-400)" }}>
                  Pattern + glow
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Faint hex-grid overlay and a soft radial pink glow, mimicking
                  the poster's textured hero panels.
                </p>
              </Card>

              <Card variant="glass" glow="cyan" size="lg" accent="cyan">
                <span className="type-label" style={{ color: "var(--cyan-400)" }}>
                  Cyan accent
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Cyan glow with a subtle outer halo — for active states and
                  success surfaces.
                </p>
              </Card>

              <Card variant="glass" pattern glow="orange" size="lg" accent="orange">
                <span className="type-label" style={{ color: "var(--orange-500)" }}>
                  Orange heat
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Warmth from the top-right corner of the poster's gradient.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Interactive --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Interactive &amp; hoverable
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <Card variant="glass" hoverable>
                <span className="type-label" style={{ color: "var(--text-secondary)" }}>
                  Hoverable
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Hover me — I lift 3px and my shadow deepens.
                </p>
              </Card>

              <Card
                variant="glass"
                clickable
                hoverable
                onClick={() => alert("Card clicked — this is the FAQ pattern.")}
              >
                <span className="type-label" style={{ color: "var(--cyan-400)" }}>
                  Clickable
                </span>
                <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                  Renders as a real button. Tab to me — cyan focus ring.
                </p>
              </Card>

              <Card variant="gradient" clickable hoverable>
                <span className="type-label" style={{ color: "var(--white)" }}>
                  Gradient CTA card
                </span>
                <p
                  className="type-body"
                  style={{ marginTop: "var(--space-2)", color: "var(--white)" }}
                >
                  For the final call-to-action on the landing page.
                </p>
                <div style={{ marginTop: "var(--space-4)" }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Register
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Real-world composition preview --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Preview: Mission, Vision, Who is it for?
            </h2>

            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              <Card variant="glass" size="md" pattern glow="pink">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <Sparkles size={16} className="icon-gradient" />
                  <span className="type-label" style={{ color: "var(--pink-400)" }}>
                    Mission
                  </span>
                </div>
                <p className="type-body">
                  To give students who are already proficient in programming a
                  guild through which to build and apply artificial intelligence
                  to their academic fields of study, and to use it as a practical
                  tool for solving real problems within those fields.
                </p>
              </Card>

              <Card variant="glass" size="md" pattern glow="cyan">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <Sparkles size={16} className="icon-gradient-cyan" />
                  <span className="type-label" style={{ color: "var(--cyan-400)" }}>
                    Vision
                  </span>
                </div>
                <p className="type-body">
                  To build a community of students who can build and apply
                  artificial intelligence to their respective academic fields.
                </p>
              </Card>

              <Card variant="glass" size="md" pattern glow="orange" accent="orange">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <ShieldCheck size={16} className="icon-gradient" />
                  <span className="type-label" style={{ color: "var(--orange-500)" }}>
                    Who is the lab for?
                  </span>
                </div>
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

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}