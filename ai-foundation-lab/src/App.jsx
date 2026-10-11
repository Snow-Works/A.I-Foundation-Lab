// src/App.jsx
import { useState } from "react";
import { ArrowRight, Play, Plus, X, Download, LogIn } from "lucide-react";
import Button from "./components/ui/Button.jsx";
import { GradientDefs } from "./components/ui/icons";

export default function App() {
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

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
              Step 1.8 — button component
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Five variants
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="icon" aria-label="Add item">
                <Plus size={18} />
              </Button>
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
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
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
              <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                Register
              </Button>
              <Button variant="secondary" leftIcon={<Play size={16} />}>
                Watch intro
              </Button>
              <Button variant="ghost" leftIcon={<LogIn size={16} />}>
                Log in
              </Button>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                pulse
              >
                Take the exam
              </Button>
            </div>
          </div>
        </section>

        {/* --- States --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              States
            </h2>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button
                variant="primary"
                loading={loading}
                onClick={simulate}
                leftIcon={<Download size={16} />}
              >
                {loading ? "Submitting…" : "Simulate loading"}
              </Button>

              <Button variant="primary" disabled>
                Disabled
              </Button>

              <Button variant="secondary" disabled>
                Disabled secondary
              </Button>

              <Button variant="icon" aria-label="Close" disabled>
                <X size={18} />
              </Button>
            </div>
          </div>
        </section>

        {/* --- Anchor mode --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              As link (href)
            </h2>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Button href="https://example.com" variant="primary" rightIcon={<ArrowRight size={16} />}>
                External link
              </Button>
              <Button href="https://example.com" variant="ghost" aria-disabled="true">
                Disabled link
              </Button>
            </div>
          </div>
        </section>

        {/* --- Full width --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container-narrow">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Full width (forms)
            </h2>

            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <Button variant="primary" size="lg" fullWidth>
                Create account
              </Button>
              <Button variant="secondary" size="lg" fullWidth>
                I already have an account
              </Button>
            </div>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}