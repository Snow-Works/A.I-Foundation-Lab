// src/pages/VerifyPending.jsx
import { useSearchParams, Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./Register.css";

export default function VerifyPending() {
  const [params] = useSearchParams();
  const email = params.get("email") || "your inbox";

  return (
    <section className="register section">
      <div className="container-narrow register__inner">
        <Card variant="glass" size="lg" withTab glow="cyan">
          <PillTab floating position="center" variant="cyan">
            Verify your email
          </PillTab>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "var(--space-5)",
              paddingTop: "var(--space-3)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(46, 200, 255, 0.10)",
                border: "1px solid rgba(46, 200, 255, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--cyan-400)",
              }}
            >
              <Mail size={28} />
            </div>

            <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
              Check your inbox
            </h1>

            <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
              We sent a verification link to <strong style={{ color: "var(--white)" }}>{email}</strong>.
              Click the link to activate your account.
            </p>

            <p className="type-body-sm" style={{ maxWidth: "46ch", margin: 0 }}>
              The link expires in 24 hours. If you don't see the email within a
              few minutes, check your spam folder.
            </p>

            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "var(--cyan-400)",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-ui)",
                fontSize: "var(--fs-sm)",
                fontWeight: 500,
              }}
            >
              Back to home
              <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}