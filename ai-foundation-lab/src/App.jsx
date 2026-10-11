// src/App.jsx
import { Sparkles, UserPlus, ShieldCheck, Camera, Users, Compass } from "lucide-react";
import { GradientDefs, JourneyIcons } from "./components/ui/icons";

export default function App() {
  const lucideIcons = [
    { name: "Sparkles", Icon: Sparkles },
    { name: "UserPlus", Icon: UserPlus },
    { name: "ShieldCheck", Icon: ShieldCheck },
    { name: "Camera", Icon: Camera },
    { name: "Users", Icon: Users },
    { name: "Compass", Icon: Compass },
  ];

  const variants = [
    { label: "icon-default", className: "icon-default" },
    { label: "icon-gradient", className: "icon-gradient" },
    { label: "icon-gradient-cyan", className: "icon-gradient-cyan" },
    { label: "icon-gradient-silver", className: "icon-gradient-silver" },
  ];

  const sizes = [16, 20, 24, 32, 48, 64];

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
        {/* --- Custom journey icons --- */}
        <section className="section">
          <div className="container">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.7 — journey icons (custom)
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Eight stages. One visual language.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {Object.entries(JourneyIcons).map(([name, Icon]) => (
                <div
                  key={name}
                  style={{
                    background: "var(--glass-bg)",
                    border: "var(--border-hairline)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    backdropFilter: "blur(var(--glass-blur))",
                    WebkitBackdropFilter: "blur(var(--glass-blur))",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <Icon
                    size={40}
                    className="icon-gradient icon-transition"
                    aria-hidden="true"
                  />
                  <span className="type-ui-strong" style={{ color: "var(--white)" }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Lucide icons with gradient stroke --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              Lucide icons with the same gradient treatment
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(140px, 100%), 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {lucideIcons.map(({ name, Icon }) => (
                <div
                  key={name}
                  style={{
                    background: "var(--glass-bg)",
                    border: "var(--border-hairline)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <Icon
                    size={40}
                    className="icon-gradient icon-transition icon-lift"
                    aria-hidden="true"
                  />
                  <span className="type-body-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Variant matrix --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              All four stroke variants
            </h2>

            <div
              style={{
                background: "var(--glass-bg)",
                border: "var(--border-hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      className="type-caption"
                      style={{
                        textAlign: "left",
                        padding: "var(--space-2) var(--space-3)",
                        borderBottom: "var(--border-hairline)",
                      }}
                    >
                      variant
                    </th>
                    {sizes.map((s) => (
                      <th
                        key={s}
                        className="type-caption"
                        style={{
                          padding: "var(--space-2) var(--space-3)",
                          borderBottom: "var(--border-hairline)",
                        }}
                      >
                        {s}px
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.label}>
                      <td
                        className="type-body-sm"
                        style={{
                          padding: "var(--space-3)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {v.label}
                      </td>
                      {sizes.map((s) => (
                        <td
                          key={s}
                          style={{
                            padding: "var(--space-3)",
                            textAlign: "center",
                          }}
                        >
                          <ShieldCheck
                            size={s}
                            className={v.className}
                            aria-hidden="true"
                            style={{ display: "inline-block" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}