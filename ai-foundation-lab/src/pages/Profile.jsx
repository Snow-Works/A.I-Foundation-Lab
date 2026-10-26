// src/pages/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogOut, Mail, Phone, User, Lock, ExternalLink, CheckCircle2,
  Image as ImageIcon, ShieldAlert, Award, Loader2, Download, FileText, Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { photoUrl, getReleasedExamResult } from "../services/profileService.js";
import { getCommunityLink, getExamCommunityLink } from "../services/settingsService.js";
import { downloadElementAsPDF } from "../lib/pdfGenerator.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import ProgressTracker from "../components/ui/ProgressTracker.jsx";
import ResultSheet from "../components/pdf/ResultSheet.jsx";
import ExamCertificate from "../components/pdf/ExamCertificate.jsx";
import AdmissionLetter from "../components/pdf/AdmissionLetter.jsx";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const wasTerminated = searchParams.get("terminated") === "1";

  const [openingGeneral, setOpeningGeneral] = useState(false);
  const [openingExam, setOpeningExam] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [examError, setExamError] = useState("");
  
  const [examResult, setExamResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(true);

  // Refs for PDF generation
  const resultSheetRef = useRef(null);
  const examCertificateRef = useRef(null);
  const admissionLetterRef = useRef(null);

  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadPDF = async (ref, filename, orientation) => {
    if (downloading) return;
    setDownloading(true);
    await downloadElementAsPDF(ref.current, filename, orientation);
    setDownloading(false);
  };

  const handleOpenGeneral = async () => {
    if (openingGeneral) return;
    setOpeningGeneral(true);
    setGeneralError("");

    try {
      const { url, enabled } = await getCommunityLink();
      if (!enabled || !url) {
        setGeneralError("The general community link isn't ready yet.");
        return;
      }
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) setGeneralError("Your browser blocked the new tab. Allow pop-ups and try again.");
    } catch (err) {
      console.error("[profile] general community error:", err);
      setGeneralError("Couldn't open the link. Try again.");
    } finally {
      setOpeningGeneral(false);
    }
  };

  const handleOpenExam = async () => {
    if (openingExam) return;
    setOpeningExam(true);
    setExamError("");

    try {
      const { url, enabled } = await getExamCommunityLink();
      if (!enabled || !url) {
        setExamError("The exam community link isn't ready yet.");
        return;
      }
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) setExamError("Your browser blocked the new tab. Allow pop-ups and try again.");
    } catch (err) {
      console.error("[profile] exam community error:", err);
      setExamError("Couldn't open the link. Try again.");
    } finally {
      setOpeningExam(false);
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
                {examResult.passed ? <Award size={40} /> : <FileText size={40} />}
              </div>
              <div className="profile__result-text">
                <h2 className="profile__result-title">
                  {examResult.passed ? "Exam Complete — Certified" : "Exam Complete"}
                </h2>
                <p className="profile__result-subtitle">
                  Your answers have been marked and released.
                </p>
              </div>
              <div className="profile__result-score">
                <span className="profile__result-number">{examResult.totalScore}</span>
                <span className="profile__result-max">/ {examResult.maxScore}</span>
              </div>
            </div>

            <div className="profile__result-actions">
              <Button 
                variant="secondary" 
                size="sm" 
                leftIcon={<Download size={14} />} 
                onClick={() => handleDownloadPDF(resultSheetRef, `Result_${fullName.replace(/\s/g, '_')}.pdf`, "portrait")}
                loading={downloading}
              >
                Download Result Sheet
              </Button>
              
              {examResult.passed && (
                <>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<Download size={14} />} 
                    onClick={() => handleDownloadPDF(examCertificateRef, `Certificate_${fullName.replace(/\s/g, '_')}.pdf`, "landscape")}
                    loading={downloading}
                  >
                    Download Exam Certificate
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<Download size={14} />} 
                    onClick={() => handleDownloadPDF(admissionLetterRef, `Admission_${fullName.replace(/\s/g, '_')}.pdf`, "portrait")}
                    loading={downloading}
                  >
                    Download Admission Letter
                  </Button>
                </>
              )}
            </div>

            {/* Hidden PDF Templates */}
            {examResult && (
              <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <ResultSheet ref={resultSheetRef} data={examResult} />
                {examResult.passed && (
                  <>
                    <ExamCertificate ref={examCertificateRef} student={user} date={new Date().toLocaleDateString()} />
                    <AdmissionLetter ref={admissionLetterRef} student={user} date={new Date().toLocaleDateString()} />
                  </>
                )}
              </div>
            )}
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

        {/* DETAILS & COMMUNITY */}
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

          {/* TWO COMMUNITY CARDS */}
          <div className="profile__community-stack">
            
            {/* Card 1: General Community */}
            <Card variant="glass" size="lg" withTab glow="pink">
              <PillTab floating position="left" variant="default">General Community</PillTab>
              {user.photo_verified ? (
                <div className="profile__community">
                  <div className="profile__community-header">
                    <CheckCircle2 size={24} className="profile__community-check" />
                    <h3 className="profile__community-title">Main Group</h3>
                  </div>
                  <p className="profile__community-desc">
                    Join the general community for orientation and updates.
                  </p>
                  <Button
                    variant="primary" size="lg" fullWidth onClick={handleOpenGeneral}
                    loading={openingGeneral} rightIcon={!openingGeneral && <ExternalLink size={16} />}
                  >
                    {openingGeneral ? "Opening…" : "Join General Group"}
                  </Button>
                  {generalError && <p className="profile__community-error">{generalError}</p>}
                  
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
                  <h3 className="profile__locked-title">Locked</h3>
                  <p className="profile__locked-desc">Upload a photo to unlock.</p>
                  <Button variant="primary" size="md" fullWidth as={Link} to="/profile/photo" rightIcon={<ExternalLink size={16} />}>
                    Upload Photo
                  </Button>
                </div>
              )}
            </Card>

            {/* Card 2: Exam Community */}
            <Card variant="glass" size="lg" withTab glow="cyan">
              <PillTab floating position="left" variant="default">Exam Community</PillTab>
              {user.photo_verified ? (
                <div className="profile__community">
                  <div className="profile__community-header">
                    <Users size={24} className="profile__community-check" style={{ color: "var(--cyan-400)" }} />
                    <h3 className="profile__community-title">Exam Group</h3>
                  </div>
                  <p className="profile__community-desc">
                    Join the main group to receive the Exam Gate link when a window opens.
                  </p>
                  <Button
                    variant="primary" size="lg" fullWidth onClick={handleOpenExam}
                    loading={openingExam} rightIcon={!openingExam && <ExternalLink size={16} />}
                    style={{ background: "var(--gradient-cyan)" }}
                  >
                    {openingExam ? "Opening…" : "Join Exam Group"}
                  </Button>
                  {examError && <p className="profile__community-error">{examError}</p>}
                </div>
              ) : (
                <div className="profile__locked">
                  <div className="profile__locked-icon" style={{ borderColor: "rgba(46, 200, 255, 0.35)", color: "var(--cyan-400)" }}><Lock size={22} /></div>
                  <h3 className="profile__locked-title">Locked</h3>
                  <p className="profile__locked-desc">Upload a photo to unlock.</p>
                  <Button variant="primary" size="md" fullWidth as={Link} to="/profile/photo" rightIcon={<ExternalLink size={16} />}>
                    Upload Photo
                  </Button>
                </div>
              )}
            </Card>

          </div>
        </div>

      </div>
    </section>
  );
}