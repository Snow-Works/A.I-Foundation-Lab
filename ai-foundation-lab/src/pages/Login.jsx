// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { loginSchema } from "../lib/validation.js";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, PasswordInput } from "../components/ui/Form.js";
import "./Register.css";

const COOLDOWN_SECONDS = 60;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState(null); // "success" | "error" | null
  const [resendMessage, setResendMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);
    setUnverifiedEmail(null);
    setResendStatus(null);
    setResendMessage("");

    try {
      const auth = await authService.login(values.email, values.password);
      console.log("[login] success:", auth);

      const from = location.state?.from || "/profile";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("[login] error:", err);

      const pbData = err?.response?.data || {};
      let message = "";
      if (pbData.email?.message) message = pbData.email.message;
      else if (pbData.password?.message) message = pbData.password.message;
      else if (err?.response?.message) message = err.response.message;
      else if (err?.message) message = err.message;

      const lowerMsg = (message || "").toLowerCase();

      // Detect unverified account — PocketBase returns a specific
      // error when `onlyVerified: true` blocks login.
      if (
        lowerMsg.includes("verify") ||
        lowerMsg.includes("verification") ||
        lowerMsg.includes("unverified") ||
        lowerMsg.includes("not verified")
      ) {
        setUnverifiedEmail(values.email);
        setFormError(
          "Your email address is not verified. Check your inbox for the verification link, or resend it below."
        );
      } else {
        setFormError(
          message || "Login failed. Open the console for details."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail || resending || cooldown > 0) return;

    setResending(true);
    setResendStatus(null);
    setResendMessage("");

    try {
      await authService.requestVerification(unverifiedEmail);
      setResendStatus("success");
      setResendMessage("Verification email sent. Check your inbox.");
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      console.error("[login] resend error:", err);

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

  const resendLabel = resending
    ? "Sending…"
    : cooldown > 0
    ? `Resend in ${cooldown}s`
    : "Resend verification email";

  return (
    <section className="register section">
      <div className="container-narrow register__inner">
        <Card variant="glass" size="lg" withTab>
          <PillTab floating position="center" variant="primary">
            Log in
          </PillTab>

          <header className="register__header">
            <h1 className="type-h2 register__title">Welcome back</h1>
            <p className="type-body register__subtitle">
              Sign in to continue your journey.
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
                autoComplete="off"
                error={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field label="Password" required error={errors.password?.message}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Your password"
                    autoComplete="off"
                    error={!!errors.password}
                  />
                )}
              />
            </Field>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "calc(-1 * var(--space-2))",
              }}
            >
              <Link
                to="/forgot-password"
                className="register__footer-link"
                style={{ fontSize: "var(--fs-sm)" }}
              >
                Forgot password?
              </Link>
            </div>

            {unverifiedEmail && (
              <div
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(242, 81, 31, 0.08)",
                  border: "1px solid rgba(242, 81, 31, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
                role="alert"
              >
                <p
                  className="type-body-sm"
                  style={{
                    margin: 0,
                    color: "var(--orange-500)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontWeight: 500,
                  }}
                >
                  <AlertCircle size={16} aria-hidden="true" />
                  Email not verified
                </p>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleResend}
                  loading={resending}
                  disabled={cooldown > 0}
                  leftIcon={<RefreshCw size={16} />}
                >
                  {resendLabel}
                </Button>

                {resendStatus === "success" && (
                  <span
                    className="type-body-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      color: "var(--cyan-400)",
                    }}
                  >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    {resendMessage}
                  </span>
                )}

                {resendStatus === "error" && (
                  <span
                    className="type-body-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      color: "#FF6B6B",
                    }}
                  >
                    <AlertCircle size={14} aria-hidden="true" />
                    {resendMessage}
                  </span>
                )}
              </div>
            )}

            {formError && !unverifiedEmail && (
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
              Log in
            </Button>

            <div className="register__footer">
              <p style={{ margin: "0 0 8px" }}>
                <Link to="/register" className="register__footer-link">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}