// src/pages/Profile.jsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogOut,
  Mail,
  Phone,
  User,
  Lock,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { photoUrl } from "../services/profileService.js";
import { getCommunityLink } from "../services/settingsService.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import ProgressTracker from "../components/ui/ProgressTracker.jsx";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const wasTerminated = searchParams.get("terminated") === "1";

  const [openingCommunity, setOpeningCommunity] = useState(false);
  const [communityError, setCommunityError] = useState("");

  if (!user) return null;

  const fullName = [user.first_name, user.middle_name, user.surname]
    .filter(Boolean)
    .join(" ");

  const photoThumb = photoUrl(user, "256x256");
  const initials =
    (user.first_name?.[0]?.toUpperCase() || "?") +
    (user.surname?.[0]?.toUpperCase() || "");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleOpenCommunity = async () => {
    if (openingCommunity) return;
    setOpeningCommunity(true);
    setCommunityError("");

    try {
      const { url, enabled } = await getCommunityLink();

      if (!enabled || !url) {
        setCommunityError(
          "The community link isn't ready yet. Check back soon."
        );
        return;
      }

      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        setCommunityError(
          "Your browser blocked the new tab. Allow pop-ups for this site and try again."
        );
      }
    } catch (err) {
      console.error("[profile] community error:", err);
      setCommunityError("Couldn't open the community link. Try again.");
    } finally {
      setOpeningCommunity(false);
    }
  };

  return (
    <section className="profile section">
      <div className="container profile__container">
        {/* ---------- TERMINATED BANNER (top of page) ---------- */}
        {wasTerminated && (
          <div className="profile__terminated-banner" role="alert">
            <ShieldAlert size={20} aria-hidden="true" />
            <div>
              <p className="profile__terminated-title">
                Your exam was terminated
              </p>
              <p className="profile__terminated-desc">
                A proctoring rule was broken twice, or fullscreen was exited.
                Your drafts were saved. You can start a fresh attempt below if
                you have attempts remaining.
              </p>
            </div>
          </div>
        )}

        {/* ---------- HEADER ---------- */}
        <header className="profile__header">
          <div className="profile__identity">
            {photoThumb ? (
              <div
                className="profile__avatar profile__avatar--with-photo"
                aria-hidden="true"
              >
                <img src={photoThumb} alt="" />
              </div>
            ) : (
              <div className="profile__avatar" aria-hidden="true">
                {initials}
              </div>
            )}

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
        <Card
          variant="glass"
          size="lg"
          withTab
          className="profile__progress-card"
        >
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

          {/* Community card */}
          <Card variant="glass" size="lg" withTab glow="pink">
            <PillTab floating position="left" variant="default">
              Community
            </PillTab>

            {user.photo_verified ? (
              <div className="profile__community-live no-select">
                <div
                  className="profile__locked-icon profile__locked-icon--success"
                  aria-hidden="true"
                >
                  <CheckCircle2 size={22} />
                </div>

                <h3 className="profile__locked-title">
                  Join the AI Foundation Lab Telegram group
                </h3>

                <p className="profile__locked-desc">
                  Your face is verified. Tap below to open the group in a new
                  tab. The link is fetched fresh each time and never stored on
                  this page.
                </p>

                <div className="profile__locked-cta">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleOpenCommunity}
                    loading={openingCommunity}
                    rightIcon={!openingCommunity && <ExternalLink size={16} />}
                  >
                    {openingCommunity ? "Opening…" : "Open Telegram group"}
                  </Button>
                </div>

                {communityError && (
                  <p className="profile__community-error" role="alert">
                    {communityError}
                  </p>
                )}

                <div className="profile__photo-preview">
                  <img src={photoThumb} alt="Your verified photo" />
                </div>

                <div className="profile__locked-cta">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    as={Link}
                    to="/profile/photo"
                    leftIcon={<ImageIcon size={14} />}
                  >
                    Replace photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="profile__locked">
                <div className="profile__locked-icon" aria-hidden="true">
                  <Lock size={22} />
                </div>

                <h3 className="profile__locked-title">
                  Join the AI Foundation Lab Telegram group
                </h3>

                <p className="profile__locked-desc">
                  Once your photo is verified, the group link unlocks here.
                  Upload a clear photo of your face to continue.
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
                  One face, well lit, no filters.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ---------- WHAT'S NEXT ---------- */}
        <Card variant="outline" size="md">
          <div className="profile__next">
            <ExternalLink
              size={16}
              className="icon-gradient"
              aria-hidden="true"
            />
            <p className="type-body-sm" style={{ margin: 0 }}>
              <strong style={{ color: "var(--white)" }}>
                What happens next:
              </strong>{" "}
              {user.photo_verified
                ? "Join the Telegram group for orientation. Admins will release the Exam Gate link when a window opens."
                : "An admin reviews your registration. Once approved, you'll upload a profile photo, unlock the Telegram community, and receive your Exam Gate link when a window opens."}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}