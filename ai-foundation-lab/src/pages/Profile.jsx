// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogOut, Mail, Phone, User, Lock, ExternalLink, CheckCircle2,
  Image as ImageIcon, ShieldAlert, Award, Star, ArrowRight, Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { photoUrl, getReleasedExamResult } from "../services/profileService.js";
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
  
  const [examResult, setExamResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    
    (async () => {
      const result = await getReleasedExamResult(user.id);
      if (!cancelled) {
        setExamResult(result);
        setLoadingResult(false);
      }
    })();
    
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return null;

  const fullName = [user.first_name, user.middle_name, user.surname].filter(Boolean).join(" ");
  const photoThumb = photoUrl(user, "256x256");
  const initials = (user.first_name?.[0]?.toUpperCase() || "?") + (user.surname?.[0]?.toUpperCase() || "");

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
        setCommunityError("The community link isn't ready yet. Check back soon.");
        return;
      }
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        setCommunityError("Your browser blocked the new tab. Allow pop-ups and try again.");
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
        
        {/* HEADER */}
        <header className="profile__header">
          <div className="profile__identity">
            {photoThumb ? (
              <div className="profile__avatar profile__avatar--with-photo">
                <img src={photoThumb} alt="" />
              </div>
            ) : (
              <div className="profile__avatar">{initials}</div>
            )}
            <div className="profile__identity-info">
              <p className="type-caption">Student Dashboard</p>
              <h1 className="profile__name">{fullName || user.email}</h1>
              <p className="profile__email">
                {user.email}
                {user.verified && <span className="profile__verified-tag">Verified</span>}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="md" leftIcon={<LogOut size={16} />} onClick={handleLogout}>
            Log out
          </Button>
        </header>

        {wasTerminated && (
          <div className="profile__terminated-banner" role="alert">
            <ShieldAlert size={20} aria-hidden="true" />
            <div>
              <p className="profile__terminated-title">Your exam was terminated</p>
              <p className="profile__terminated-desc">
                A proctoring rule was broken twice, or fullscreen was exited. Your drafts were saved.
              </p>
            </div>
          </div>
        )}

        {/* EXAM RESULT HIGHLIGHT */}
        {!loadingResult && examResult && (
          <Card variant="gradient" size="lg" className="profile__result-card">
            <div className="profile__result-content">
              <div className="profile__result-icon">
                <Award size={40} />
              </div>
              <div className="profile__result-text">
                <h2 className="profile__result-title">Exam Complete</h2>
                <p className="profile__result-subtitle">
                  Your answers have been marked and released.
                </p>
              </div>
              <div className="profile__result-score">
                <span className="profile__result-number">{examResult.totalScore}</span>
                <span className="profile__result-max">/ {examResult.maxScore}</span>
              </div>
            </div>
          </Card>
        )}

        {/* PROGRESS TRACKER */}
        <Card variant="glass" size="lg" withTab className="profile__progress-card">
          <PillTab floating position="center" variant="default">Your Journey</PillTab>
          <ProgressTracker
            currentState={user.status || "REGISTERED"}
            overrides={user.status === "REJECTED" ? { APPROVED: "error" } : {}}
          />
        </Card>

        {/* DETAILS GRID */}
        <div className="profile__grid">
          
          {/* Registration details */}
          <Card variant="glass" size="lg" withTab glow="cyan">
            <PillTab floating position="left" variant="default">Profile Details</PillTab>
            <div className="profile__details-list">
              <div className="profile__detail-item">
                <div className="profile__detail-icon"><User size={16} /></div>
                <div>
                  <span className="profile__detail-label">Full Name</span>
                  <span className="profile__detail-value">{fullName || "—"}</span>
                </div>
              </div>
              <div className="profile__detail-item">
                <div className="profile__detail-icon"><Mail size={16} /></div>
                <div>
                  <span className="profile__detail-label">Email Address</span>
                  <span className="profile__detail-value">{user.email}</span>
                </div>
              </div>
              <div className="profile__detail-item">
                <div className="profile__detail-icon"><Phone size={16} /></div>
                <div>
                  <span className="profile__detail-label">WhatsApp</span>
                  <span className="profile__detail-value">{user.whatsapp || "—"}</span>
                </div>
              </div>
            </div>
            <p className="profile__hint">
              To update these details, contact an admin in the Telegram group.
            </p>
          </Card>

          {/* Community Card */}
          <Card variant="glass" size="lg" withTab glow="pink">
            <PillTab floating position="left" variant="default">Community</PillTab>
            {user.photo_verified ? (
              <div className="profile__community">
                <div className="profile__community-header">
                  <CheckCircle2 size={24} className="profile__community-check" />
                  <h3 className="profile__community-title">Telegram Group</h3>
                </div>
                <p className="profile__community-desc">
                  Your face is verified. Click below to open the guild group in a new tab.
                </p>
                <Button
                  variant="primary" size="lg" fullWidth onClick={handleOpenCommunity}
                  loading={openingCommunity} rightIcon={!openingCommunity && <ExternalLink size={16} />}
                >
                  {openingCommunity ? "Opening…" : "Open Telegram"}
                </Button>
                {communityError && <p className="profile__community-error">{communityError}</p>}
                
                <div className="profile__photo-preview-wrap">
                  <img src={photoThumb} alt="Verified" className="profile__photo-preview" />
                  <Link to="/profile/photo" className="profile__photo-replace">
                    <ImageIcon size={14} /> Replace photo
                  </Link>
                </div>
              </div>
            ) : (
              <div className="profile__locked">
                <div className="profile__locked-icon"><Lock size={22} /></div>
                <h3 className="profile__locked-title">Join the AI Foundation Lab</h3>
                <p className="profile__locked-desc">Upload a clear photo of your face to unlock the community.</p>
                <Button variant="primary" size="md" fullWidth as={Link} to="/profile/photo" rightIcon={<ExternalLink size={16} />}>
                  Upload Photo
                </Button>
              </div>
            )}
          </Card>
        </div>

      </div>
    </section>
  );
}