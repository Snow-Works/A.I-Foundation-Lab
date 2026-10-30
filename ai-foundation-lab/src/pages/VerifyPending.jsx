// src/pages/VerifyPending.jsx
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./Register.css";

const COOLDOWN_SECONDS = 60;

export default function VerifyPending() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState(null); // "success" | "error" | null
  const [resendMessage, setResendMessage] = useState("");

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || resending || cooldown > 0) return;

    setResending(true);
    setResendStatus(null);
    setResendMessage("");

    try {
      await authService.requestVerification(email);
      setResendStatus("success");
      setResendMessage("Verification email sent. Check your inbox.");
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      console.error("[verify-pending] resend error:", err);

      if (err?.status === 429) {
        setResendStatus("error");
        setResendMessage("Too many requests. Wait a minute and try again.");
        setCooldown(COOLDOWN_SECONDS);
      } else {
        setResendStatus("error");
        setResendMessage(
          err?.response?.message ||
            err?.message ||
            "Could not send the email. Please try again."
        );
      }
    } finally {
      setResending(false);
    }
  };

  const buttonLabel = resending
    ? "Sending…"
    : cooldown > 0
    ? `Resend in ${cooldown}s`
    : "Resend verification email";

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

            <h1
              className="type-h3"
              style={{ color: "var(--white)", margin: 0 }}
            >
              Check your inbox
            </h1>

            <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
              We sent a verification link to{" "}
              <strong style={{ color: "var(--white)" }}>
                {email || "your inbox"}
              </strong>
              . Click the link to activate your account.
            </p>

            <p className="type-body-sm" style={{ maxWidth: "46ch", margin: 0 }}>
              The link expires in 24 hours. If you don't see the email within a
              few minutes, check your spam folder.
            </p>

            {email && (
              <div
                style={{
                  width: "100%",
                  paddingTop: "var(--space-4)",
                  borderTop: "1px solid var(--glass-border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <p className="type-body-sm" style={{ margin: 0 }}>
                  Didn't receive the email?
                </p>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleResend}
                  loading={resending}
                  disabled={cooldown > 0}
                  leftIcon={<RefreshCw size={16} />}
                >
                  {buttonLabel}
                </Button>

                {resendStatus === "success" && (
                  <div
                    className="type-body-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      color: "var(--cyan-400)",
                    }}
                    role="status"
                  >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    {resendMessage}
                  </div>
                )}

                {resendStatus === "error" && (
                  <div
                    className="type-body-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      color: "#FF6B6B",
                    }}
                    role="alert"
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {resendMessage}
                  </div>
                )}
              </div>
            )}

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
                marginTop: "var(--space-2)",
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