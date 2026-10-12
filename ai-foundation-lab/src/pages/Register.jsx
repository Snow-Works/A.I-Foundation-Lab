// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, ArrowRight, Info } from "lucide-react";
import { registerSchema } from "../lib/validation.js";
import { authService } from "../services";
import { COUNTRIES } from "../components/ui/PhoneInput.jsx";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import {
  Field,
  Input,
  PasswordInput,
  PhoneInput,
  Checkbox,
} from "../components/ui/Form.js";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      middleName: "",
      surname: "",
      email: "",
      whatsapp: { display: "", digits: "", country: "NG" },
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    setFormError(null);

    // Build E.164 WhatsApp number from digits + country code
    const country = COUNTRIES[values.whatsapp.country] || COUNTRIES.NG;
    const e164 = `${country.code}${values.whatsapp.digits}`;

    try {
      await authService.register({
        email: values.email,
        password: values.password,
        passwordConfirm: values.confirmPassword,
        first_name: values.firstName,
        middle_name: values.middleName || "",
        surname: values.surname,
        whatsapp: e164,
      });

      // Redirect to the "check your inbox" screen
      navigate(
        `/verify-pending?email=${encodeURIComponent(values.email)}`,
        { replace: true }
      );
    } catch (err) {
      // PocketBase returns field-level errors in err.response.data
      const pbErrors = err?.response?.data || {};
      let handled = false;

      for (const field of Object.keys(pbErrors)) {
        const message = pbErrors[field]?.message;
        if (!message) continue;

        if (field === "email") {
          setError("email", { type: "server", message });
          handled = true;
        } else if (field === "password") {
          setError("password", { type: "server", message });
          handled = true;
        }
      }

      if (!handled) {
        setFormError(
          err?.message || "Something went wrong. Please try again."
        );
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
            Register
          </PillTab>

          <header className="register__header">
            <h1 className="type-h2 register__title">Create your account</h1>
            <p className="type-body register__subtitle">
              Use the same full name you used for your school registration.
            </p>
          </header>

          <form
            className="register__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="register__row register__row--three">
              <Field
                label="First name"
                required
                error={errors.firstName?.message}
              >
                <Input
                  type="text"
                  placeholder="Snow"
                  leftIcon={<User size={16} />}
                  autoComplete="given-name"
                  error={!!errors.firstName}
                  {...register("firstName")}
                />
              </Field>

              <Field
                label="Middle name"
                error={errors.middleName?.message}
              >
                <Input
                  type="text"
                  placeholder="other name"
                  autoComplete="additional-name"
                  error={!!errors.middleName}
                  {...register("middleName")}
                />
              </Field>

              <Field
                label="Surname"
                required
                error={errors.surname?.message}
              >
                <Input
                  type="text"
                  placeholder="Works"
                  autoComplete="family-name"
                  error={!!errors.surname}
                  {...register("surname")}
                />
              </Field>
            </div>

            <Field
              label="Email"
              required
              error={errors.email?.message}
              hint="We'll send a verification link to this address."
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
              label="WhatsApp number"
              required
              error={errors.whatsapp?.message}
              hint="Include your country, we use this to reach you."
            >
              <Controller
                name="whatsapp"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country={field.value.country}
                    value={field.value.display}
                    error={!!errors.whatsapp}
                    onChange={(e) => {
                      field.onChange({
                        display: e.target.value,
                        digits: e.target.digits,
                        country: e.target.country,
                      });
                    }}
                  />
                )}
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
                    placeholder="At least 8 characters"
                    showStrength
                    autoComplete="new-password"
                    error={!!errors.password}
                  />
                )}
              />
            </Field>

            <Field
              label="Confirm password"
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
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                  />
                )}
              />
            </Field>

            <div className="register__agree">
              <Controller
                name="agree"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="I confirm I used the same full name I used for my school registration."
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    error={!!errors.agree}
                  />
                )}
              />
              {errors.agree && (
                <p className="register__agree-error">{errors.agree.message}</p>
              )}
            </div>

            {formError && (
              <div className="register__form-error" role="alert">
                <Info size={16} aria-hidden="true" />
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
              Create account
            </Button>

            <p className="register__footer">
              Already have an account?{" "}
              <Link to="/login" className="register__footer-link">
                Log in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}