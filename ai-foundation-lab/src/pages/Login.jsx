// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Info, AlertCircle } from "lucide-react";
import { loginSchema } from "../lib/validation.js";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, PasswordInput } from "../components/ui/Form.js";
import "./Register.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);
    setNeedsVerification(false);

    try {
      await authService.login(values.email, values.password);
      // Refresh auth context so the navbar re-renders
      await refresh();

      // Where to send the user? Default to home for now.
      // Step 3.10 will wire this to /profile.
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.message || err?.message || "";

      // PocketBase returns a specific message when the email isn't verified
      if (message.toLowerCase().includes("verif")) {
        setNeedsVerification(true);
        setFormError(
          "Your email isn't verified yet. Check your inbox for the verification link, or request a new one below."
        );
      } else if (
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("credentials")
      ) {
        setFormError("Email or password is incorrect.");
      } else {
        setFormError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            <Field
              label="Email"
              required
              error={errors.email?.message}
            >
              <Input
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                autoComplete="email"
                error={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field
              label="Password"
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
                    placeholder="Your password"
                    autoComplete="current-password"
                    error={!!errors.password}
                  />
                )}
              />
            </Field>

            {formError && (
              <div className="register__form-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <div>
                  <span>{formError}</span>
                  {needsVerification && (
                    <div style={{ marginTop: 8 }}>
                      <Link
                        to={`/verify-pending?email=${encodeURIComponent(
                          control._formValues.email || ""
                        )}`}
                        className="register__footer-link"
                      >
                        Resend verification email
                      </Link>
                    </div>
                  )}
                </div>
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
              <p style={{ margin: 0 }}>
                Forgot your password?{" "}
                <span style={{ color: "var(--text-muted)" }}>Coming soon</span>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}