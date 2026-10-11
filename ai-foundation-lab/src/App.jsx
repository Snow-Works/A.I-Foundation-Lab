// src/App.jsx
import Wordmark from "./components/ui/Wordmark.jsx";
import LogoMark from "./components/ui/LogoMark.jsx";

export default function App() {
  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100dvh",
        color: "var(--white)",
      }}
    >
      <section className="section">
        <div className="container">
          <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
            Step 1.6 — wordmark
          </p>

          {/* Full wordmark on the signature gradient — proves contrast */}
          <div
            style={{
              background: "var(--gradient-signature)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(20px, 5vw, 64px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
            }}
          >
            <Wordmark width={320} style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2
            className="type-h3"
            style={{ color: "var(--white)", marginBottom: "var(--space-4)" }}
          >
            Logo mark — compact contexts
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <LogoMark size={64} style={{ color: "var(--white)" }} />
            <LogoMark size={48} style={{ color: "var(--white)" }} />
            <LogoMark size={32} style={{ color: "var(--white)" }} />
            <LogoMark size={24} style={{ color: "var(--white)" }} />
            <LogoMark size={16} style={{ color: "var(--white)" }} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2
            className="type-h3"
            style={{ color: "var(--white)", marginBottom: "var(--space-4)" }}
          >
            Wordmark on plain navy
          </h2>

          <div
            style={{
              background: "var(--glass-bg)",
              border: "var(--border-hairline)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(20px, 5vw, 48px)",
              backdropFilter: "blur(var(--glass-blur))",
              WebkitBackdropFilter: "blur(var(--glass-blur))",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Wordmark width={260} style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      <div style={{ height: "var(--space-8)" }} />
    </div>
  );
}