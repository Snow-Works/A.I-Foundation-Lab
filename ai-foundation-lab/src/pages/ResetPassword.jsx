// src/pages/ResetPassword.jsx
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { resetPasswordSchema } from "../lib/validation.js";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, PasswordInput } from "../components/ui/Form.js";
import "./Register.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const email = params.get("email") || "";

  const [state, setState] = useState(token ? "form" : "invalid");
  const [errorReason, setErrorReason] = useState(
    token ? null : "This password reset link is missing its token."
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);

    try {
      await authService.confirmPasswordReset(
        token,
        values.password,
        values.confirmPassword
      );
      setState("success");
    } catch (err) {
      console.error("[reset-password] error:", err);

      const pbData = err?.response?.data || {};
      const message =
        pbData.password?.message ||
        pbData.token?.message ||
        err?.response?.message ||
        err?.message ||
        "We couldn't reset your password.";

      // Detect expired/invalid token errors so we can show the
      // full-page error state instead of an inline form error.
      const lowerMsg = message.toLowerCase();
      if (
        lowerMsg.includes("expired") ||
        lowerMsg.includes("invalid") ||
        lowerMsg.includes("token")
      ) {
        setErrorReason(
          "This reset link has expired or is invalid. Request a new one."
        );
        setState("invalid");
        return;
      }

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- INVALID STATE ---------- */
  if (state === "invalid") {
    return (
      <section className="register section">
        <div className="container-narrow register__inner">
          <Card variant="glass" size="lg" withTab tone="danger">
            <PillTab floating position="center" variant="default">
              Link unavailable
            </PillTab>

            <div className="auth-verified__wrap">
              <div className="auth-verified__icon auth-verified__icon--error">
                <XCircle size={30} />
              </div>

              <h1
                className="type-h3"
                style={{ color: "var(--white)", margin: 0 }}
              >
                We couldn't open this reset link
              </h1>

              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                {errorReason}
              </p>

              <p className="type-body-sm" style={{ maxWidth: "46ch", margin: 0 }}>
                Reset links expire after 1 hour and can only be used once.
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
                >
                  Request a new link
                </Button>
                <Button variant="primary" size="md" as={Link} to="/login">
                  Back to login
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------- SUCCESS STATE ---------- */
  if (state === "success") {
    return (
      <section className="register section">
        <div className="container-narrow register__inner">
          <Card variant="glass" size="lg" withTab glow="cyan">
            <PillTab floating position="center" variant="cyan">
              Password updated
            </PillTab>

            <div className="auth-verified__wrap">
              <div className="auth-verified__icon auth-verified__icon--success">
                <CheckCircle2 size={30} />
              </div>

              <h1
                className="type-h3"
                style={{ color: "var(--white)", margin: 0 }}
              >
                Password reset
              </h1>

              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                Your password has been updated. You can now log in with your
                new password.
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login", { replace: true })}
                rightIcon={<ArrowRight size={18} />}
              >
                Go to login
              </Button>
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
            New password
          </PillTab>

          <header className="register__header">
            <h1 className="type-h2 register__title">Set a new password</h1>
            <p className="type-body register__subtitle">
              {email ? (
                <>
                  Resetting password for{" "}
                  <strong style={{ color: "var(--white)" }}>{email}</strong>
                </>
              ) : (
                "Choose a strong password you haven't used before."
              )}
            </p>
          </header>

          <form
            className="register__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Field
              label="New password"
              required
              error={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="At least 8 characters"
                    showStrength
                    autoComplete="new-password"
                    error={!!errors.password}
                  />
                )}
              />
            </Field>

            <Field
              label="Confirm new password"
              required
              error={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                  />
                )}
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
              {submitting ? "Resetting…" : "Reset password"}
            </Button>

            <p className="register__footer">
              <Link to="/forgot-password" className="register__footer-link">
                Request a new link
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}