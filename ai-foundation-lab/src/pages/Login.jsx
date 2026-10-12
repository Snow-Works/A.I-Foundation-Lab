// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginSchema } from "../lib/validation.js";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, PasswordInput } from "../components/ui/Form.js";
import "./Register.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

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

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);
    console.log("[login] submitting with:", { email: values.email });

    try {
      const auth = await authService.login(values.email, values.password);
      console.log("[login] success:", auth);

      // No refresh() call needed.
      // authWithPassword already populated pb.authStore,
      // and AuthContext's onChange listener will fire immediately.

      const from = location.state?.from || "/profile";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("[login] error object:", err);
      console.error("[login] err.response:", err?.response);
      console.error("[login] err.response.data:", err?.response?.data);

      const pbData = err?.response?.data || {};
      let message = "";
      if (pbData.email?.message) message = pbData.email.message;
      else if (pbData.password?.message) message = pbData.password.message;
      else if (err?.response?.message) message = err.response.message;
      else if (err?.message) message = err.message;

      setFormError(message || "Login failed. Open the console for details.");
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