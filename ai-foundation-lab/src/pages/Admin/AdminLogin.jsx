// src/pages/Admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { loginSchema } from "../../lib/validation.js";
import { loginAdmin } from "../../services/adminService.js";
import Card from "../../components/ui/Card.jsx";
import PillTab from "../../components/ui/PillTab.jsx";
import Button from "../../components/ui/Button.jsx";
import { Field, Input, PasswordInput } from "../../components/ui/Form.js";
import "./AdminLogin.css";

export default function AdminLogin() {
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

    try {
      await loginAdmin(values.email, values.password);
      const from = location.state?.from || "/admin";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("[admin-login] error:", err);
      const pbData = err?.response?.data || {};
      const message =
        pbData.email?.message ||
        pbData.password?.message ||
        err?.response?.message ||
        "Invalid admin credentials.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-login section">
      <div className="container-narrow admin-login__container">
        <Card variant="glass" size="lg" withTab glow="cyan">
          <PillTab floating position="center" variant="cyan">
            Admin Access
          </PillTab>

          <header className="admin-login__header">
            <div className="admin-login__icon">
              <Shield size={28} />
            </div>
            <h1 className="type-h2 admin-login__title">Admin Login</h1>
            <p className="type-body admin-login__subtitle">
              This area is restricted to authorized staff.
            </p>
          </header>

          <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Email" required error={errors.email?.message}>
              <Input
                type="email"
                placeholder="admin@aifoundationlab.dev"
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
                    placeholder="Your admin password"
                    autoComplete="off"
                    error={!!errors.password}
                  />
                )}
              />
            </Field>

            {formError && (
              <div className="admin-login__form-error" role="alert">
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
          </form>
        </Card>
        
        <div className="admin-login__footer">
          <Link to="/">← Back to main site</Link>
        </div>
      </div>
    </section>
  );
}