// src/pages/AuthVerified.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { authService } from "../services";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./Register.css";

export default function AuthVerified() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [state, setState] = useState("verifying"); // verifying | success | error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setErrorMessage("This verification link is missing its token.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await authService.confirmVerification(token);
        if (!cancelled) setState("success");
      } catch (err) {
        if (cancelled) return;

        const message =
          err?.response?.message ||
          err?.message ||
          "We couldn't verify this link. It may have expired or already been used.";

        setErrorMessage(message);
        setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ---------- VERIFYING ---------- */
  if (state === "verifying") {
    return (
      <section className="register section">
        <div className="container-narrow register__inner">
          <Card variant="glass" size="lg">
            <div className="auth-verified__wrap">
              <div className="auth-verified__icon auth-verified__icon--pending">
                <Loader2 size={28} className="auth-verified__spinner" />
              </div>
              <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
                Verifying your email
              </h1>
              <p className="type-body" style={{ maxWidth: "44ch", margin: 0 }}>
                One moment — we're confirming your account.
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------- SUCCESS ---------- */
  if (state === "success") {
    return (
      <section className="register section">
        <div className="container-narrow register__inner">
          <Card variant="glass" size="lg" withTab glow="cyan">
            <PillTab floating position="center" variant="cyan">
              Verified
            </PillTab>

            <div className="auth-verified__wrap">
              <div className="auth-verified__icon auth-verified__icon--success">
                <CheckCircle2 size={30} />
              </div>

              <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
                Email verified
              </h1>

              <p className="type-body" style={{ maxWidth: "46ch", margin: 0 }}>
                {email ? (
                  <>
                    <strong style={{ color: "var(--white)" }}>{email}</strong>{" "}
                    is now verified.
                  </>
                ) : (
                  "Your email is now verified."
                )}{" "}
                Your account is waiting for admin approval — you'll be notified
                in the Telegram group once you're in.
              </p>

              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                as={Link}
                to="/login"
              >
                Go to login
              </Button>

              <Link
                to="/"
                className="type-body-sm"
                style={{ color: "var(--text-muted)", textDecoration: "none" }}
              >
                Back to home
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------- ERROR ---------- */
  return (
    <section className="register section">
      <div className="container-narrow register__inner">
        <Card variant="glass" size="lg" withTab tone="danger">
          <PillTab floating position="center" variant="default">
            Verification failed
          </PillTab>

          <div className="auth-verified__wrap">
            <div className="auth-verified__icon auth-verified__icon--error">
              <XCircle size={30} />
            </div>

            <h1 className="type-h3" style={{ color: "var(--white)", margin: 0 }}>
              We couldn't verify this link
            </h1>

            <p className="type-body" style={{ maxWidth: "48ch", margin: 0 }}>
              {errorMessage}
            </p>

            <p className="type-body-sm" style={{ maxWidth: "48ch", margin: 0 }}>
              Verification links expire after 24 hours and can only be used
              once. Log in to your account to request a new one, or contact us
              if the issue continues.
            </p>

            <Button
              variant="secondary"
              size="lg"
              as={Link}
              to="/login"
            >
              Go to login
            </Button>

            <Link
              to="/"
              className="type-body-sm"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
            >
              Back to home
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}