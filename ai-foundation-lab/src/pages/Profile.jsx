// src/pages/Profile.jsx
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone, User, Lock, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import ProgressTracker from "../components/ui/ProgressTracker.jsx";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const fullName = [user.first_name, user.middle_name, user.surname]
    .filter(Boolean)
    .join(" ");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <section className="profile section">
      <div className="container profile__container">
        {/* ---------- HEADER ---------- */}
        <header className="profile__header">
          <div className="profile__identity">
            <div className="profile__avatar" aria-hidden="true">
              {user.first_name?.[0]?.toUpperCase() || "?"}
              {user.surname?.[0]?.toUpperCase() || ""}
            </div>
            <div>
              <p className="type-caption" style={{ marginBottom: 4 }}>
                Welcome back
              </p>
              <h1 className="profile__name">{fullName || user.email}</h1>
              <p className="profile__email type-body-sm">{user.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="md"
            leftIcon={<LogOut size={16} />}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </header>

        {/* ---------- PROGRESS ---------- */}
        <Card variant="glass" size="lg" withTab className="profile__progress-card">
          <PillTab floating position="center" variant="default">
            Your Progress
          </PillTab>

          <ProgressTracker
            currentState={user.status || "REGISTERED"}
            overrides={user.status === "REJECTED" ? { APPROVED: "error" } : {}}
          />
        </Card>

        {/* ---------- DETAILS + COMMUNITY ---------- */}
        <div className="profile__grid">
          {/* Registration details */}
          <Card variant="glass" size="lg" withTab glow="cyan">
            <PillTab floating position="left" variant="default">
              Registration details
            </PillTab>

            <dl className="profile__details">
              <div className="profile__detail">
                <dt>
                  <User size={14} aria-hidden="true" />
                  Full name
                </dt>
                <dd>{fullName || "—"}</dd>
              </div>

              <div className="profile__detail">
                <dt>
                  <Mail size={14} aria-hidden="true" />
                  Email
                </dt>
                <dd>
                  {user.email}
                  {user.verified && (
                    <span className="profile__verified-tag">Verified</span>
                  )}
                </dd>
              </div>

              <div className="profile__detail">
                <dt>
                  <Phone size={14} aria-hidden="true" />
                  WhatsApp
                </dt>
                <dd>{user.whatsapp || "—"}</dd>
              </div>
            </dl>

            <p className="profile__hint">
              To update these details, contact an admin in the Telegram group.
              This keeps your record consistent with your school registration.
            </p>
          </Card>

          {/* Community link */}
          <Card variant="glass" size="lg" withTab glow="pink">
            <PillTab floating position="left" variant="default">
              Community
            </PillTab>

            <div className="profile__locked">
              <div className="profile__locked-icon" aria-hidden="true">
                <Lock size={22} />
              </div>

              <h3 className="profile__locked-title">
                Join the AI Foundation Lab Telegram group
              </h3>

              <p className="profile__locked-desc">
                Once your photo is verified, the group link unlocks here.
                Upload a clear photo of your face from your profile to
                continue.
              </p>

              <div className="profile__locked-cta">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  as={Link}
                  to="/profile/photo"
                  rightIcon={<ExternalLink size={16} />}
                >
                  Upload your photo
                </Button>
              </div>

              <p className="profile__locked-note">
                Photo verification arrives in the next phase of the build.
              </p>
            </div>
          </Card>
        </div>

        {/* ---------- WHAT'S NEXT ---------- */}
        <Card variant="outline" size="md">
          <div className="profile__next">
            <ExternalLink size={16} className="icon-gradient" aria-hidden="true" />
            <p className="type-body-sm" style={{ margin: 0 }}>
              <strong style={{ color: "var(--white)" }}>What happens next:</strong>{" "}
              An admin reviews your registration. Once approved, you'll upload
              a profile photo, unlock the Telegram community, and receive your
              Exam Gate link when a window opens.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}