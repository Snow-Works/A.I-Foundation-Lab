// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "../lib/validation.js";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input } from "../components/ui/Form.js";
import "./Register.css";

export default function ForgotPassword() {
  const [state, setState] = useState("form"); // "form" | "sent"
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);

    try {
      await authService.requestPasswordReset(values.email);
      setSentEmail(values.email);
      setState("sent");
    } catch (err) {
      // PocketBase returns 404 for unknown emails. Treat the same as
      // success to prevent email enumeration.
      if (err?.status === 404) {
        setSentEmail(values.email);
        setState("sent");
        return;
      }

      if (err?.status === 429) {
        setFormError("Too many requests. Wait a few minutes and try again.");
      } else {
        setFormError(
          err?.response?.message ||
            err?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- SENT STATE ---------- */
  if (state === "sent") {
    return (
      <section className="register section">
        <div className="container-narrow register__inner">
          <Card variant="glass" size="lg" withTab glow="cyan">
            <PillTab floating position="center" variant="cyan">
              Check your inbox
            </PillTab>

            <div className="auth-verified__wrap">
              <div className="auth-verified__icon auth-verified__icon--success">
                <CheckCircle2 size={30} />
              </div>

              <h1
                className="type-h3"
                style={{ color: "var(--white)", margin: 0 }}
              >
                Reset link sent
              </h1>

              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                If <strong style={{ color: "var(--white)" }}>{sentEmail}</strong>{" "}
                is registered, a password reset link is on its way. Click the
                link in the email to set a new password.
              </p>

              <p className="type-body-sm" style={{ maxWidth: "46ch", margin: 0 }}>
                The link expires in 1 hour. If you don't see the email in a few
                minutes, check your spam folder.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  as={Link}
                  to="/forgot-password"
                  onClick={() => {
                    setState("form");
                    setSentEmail("");
                  }}
                >
                  Try a different email
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  as={Link}
                  to="/login"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Back to login
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------- FORM STATE ---------- */
  return (
    <section className="register section">
      <div className="container-narrow register__inner">
        <Card variant="glass" size="lg" withTab>
          <PillTab floating position="center" variant="primary">
            Reset password
          </PillTab>

          <header className="register__header">
            <h1 className="type-h2 register__title">Forgot your password?</h1>
            <p className="type-body register__subtitle">
              Enter the email you registered with and we'll send you a link to
              set a new password.
            </p>
          </header>

          <form
            className="register__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Field label="Email" required error={errors.email?.message}>
              <Input
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                autoComplete="email"
                error={!!errors.email}
                {...register("email")}
              />
            </Field>

            {formError && (
              <div className="register__form-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              rightIcon={<ArrowRight size={18} />}
            >
              {submitting ? "Sending…" : "Send reset link"}
            </Button>

            <p className="register__footer">
              Remembered it?{" "}
              <Link to="/login" className="register__footer-link">
                Back to login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}