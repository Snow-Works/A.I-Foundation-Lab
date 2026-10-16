// src/pages/ExamGate.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { identitySchema } from "../lib/validation.js";
import {
  getGateToken,
  validateGateToken,
  confirmIdentityAndClaimToken,
} from "../services/examService.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, Input, PasswordInput } from "../components/ui/Form.js";
import "./ExamGate.css";

const STATUS = {
  LOADING: "loading",
  FORM: "form",
  INVALID: "invalid",
  SUBMITTING: "submitting",
};

const REASON_COPY = {
  not_found:
    "This exam link doesn't exist. Ask the admin for a fresh one.",
  revoked:
    "This exam link has been cancelled. Ask the admin for a new one.",
  expired:
    "This exam link has expired. Ask the admin for a new one.",
  already_used:
    "This exam link has already been used. Each link works only once.",
};

export default function ExamGate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const recordId = params.get("id");

  const [status, setStatus] = useState(STATUS.LOADING);
  const [errorReason, setErrorReason] = useState(null);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(identitySchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!recordId) {
        if (!cancelled) {
          setErrorReason("not_found");
          setStatus(STATUS.INVALID);
        }
        return;
      }

      try {
        const record = await getGateToken(recordId);
        if (cancelled) return;

        const check = validateGateToken(record);
        if (!check.valid) {
          setErrorReason(check.reason);
          setStatus(STATUS.INVALID);
          return;
        }

        setStatus(STATUS.FORM);
      } catch (err) {
        if (cancelled) return;
        console.error("[exam-gate] load error:", err);
        setErrorReason("not_found");
        setStatus(STATUS.INVALID);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [recordId]);

  const onSubmit = async (values) => {
    setFormError("");
    setStatus(STATUS.SUBMITTING);

    try {
      await confirmIdentityAndClaimToken({
        recordId,
        email: values.email,
        password: values.password,
      });
      navigate("/exam/intro", { replace: true });
    } catch (err) {
      console.error("[exam-gate] claim error:", err);
      const pbData = err?.response?.data || {};
      const message =
        pbData.email?.message ||
        pbData.password?.message ||
        err?.response?.message ||
        "We couldn't confirm your identity. Check your email and password.";

      // Special-case: someone else already claimed the token
      if (
        pbData.used_by?.message ||
        (err?.status === 400 && /used_by/i.test(message))
      ) {
        setErrorReason("already_used");
        setStatus(STATUS.INVALID);
        return;
      }

      setFormError(message);
      setStatus(STATUS.FORM);
    }
  };

  /* ---------- RENDERING ---------- */

  if (status === STATUS.LOADING) {
    return (
      <section className="exam-gate section">
        <div className="container-narrow">
          <Card variant="glass" size="lg">
            <div className="exam-gate__center">
              <Loader2 size={28} className="exam-gate__spinner" />
              <p className="type-body" style={{ margin: 0 }}>
                Checking your link…
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (status === STATUS.INVALID) {
    return (
      <section className="exam-gate section">
        <div className="container-narrow">
          <Card variant="glass" size="lg" withTab tone="danger">
            <PillTab floating position="center" variant="default">
              Link unavailable
            </PillTab>

            <div className="exam-gate__center">
              <div className="exam-gate__icon exam-gate__icon--error">
                <XCircle size={30} />
              </div>
              <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
                We couldn't open this exam link
              </h1>
              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                {REASON_COPY[errorReason] || "This link is not valid."}
              </p>
              <Button variant="secondary" size="lg" as={Link} to="/profile">
                Back to profile
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------- FORM ---------- */
  const isSubmitting = status === STATUS.SUBMITTING;

  return (
    <section className="exam-gate section">
      <div className="container-narrow">
        <Card variant="glass" size="lg" withTab glow="pink">
          <PillTab floating position="center" variant="primary">
            Identity confirmation
          </PillTab>

          <header className="exam-gate__header">
            <div className="exam-gate__icon exam-gate__icon--info">
              <ShieldCheck size={28} />
            </div>
            <h1 className="type-h3 exam-gate__title">
              Confirm your identity
            </h1>
            <p className="type-body exam-gate__subtitle">
              This exam link is single-use. Before we open the exam, re-enter
              your registered email and password to prove it's you.
            </p>
          </header>

          <form
            className="exam-gate__form"
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
              <div className="exam-gate__form-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              rightIcon={<ArrowRight size={18} />}
            >
              {isSubmitting ? "Confirming…" : "Confirm and continue"}
            </Button>
          </form>

          <p className="exam-gate__note">
            Your credentials are sent directly to our servers. This is the
            same login you used when you registered.
          </p>
        </Card>
      </div>
    </section>
  );
}