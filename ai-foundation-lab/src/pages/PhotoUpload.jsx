// src/pages/PhotoUpload.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Camera,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { detectFacesInFile } from "../lib/faceDetector.js";
import { compressImage } from "../lib/imageCompressor.js";
import { uploadProfilePhoto } from "../services/profileService.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./PhotoUpload.css";

const STATUS = {
  IDLE: "idle",
  ANALYZING: "analyzing",
  COMPRESSING: "compressing",
  VALID: "valid",
  NO_FACE: "no_face",
  MULTIPLE_FACES: "multiple_faces",
  ERROR: "error",
};

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PhotoUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const previousUrlRef = useRef(null);

  const [status, setStatus] = useState(STATUS.IDLE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [faceCount, setFaceCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const swapPreview = (newUrl) => {
    if (previousUrlRef.current && previousUrlRef.current !== newUrl) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
    previousUrlRef.current = newUrl;
    setPreviewUrl(newUrl);
  };

  const openFilePicker = () => {
    if (saving) return;
    fileInputRef.current?.click();
  };

  const resetAll = () => {
    swapPreview(null);
    setCompressedFile(null);
    setFaceCount(0);
    setStats(null);
    setErrorMessage("");
    setSaveError("");
    setStatus(STATUS.IDLE);
  };

  const handleFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetAll();
    swapPreview(URL.createObjectURL(file));
    setStatus(STATUS.ANALYZING);

    try {
      const { count } = await detectFacesInFile(file);
      setFaceCount(count);

      if (count === 0) {
        setStatus(STATUS.NO_FACE);
        return;
      }
      if (count > 1) {
        setStatus(STATUS.MULTIPLE_FACES);
        return;
      }

      setStatus(STATUS.COMPRESSING);
      const result = await compressImage(file);

      swapPreview(URL.createObjectURL(result.blob));
      setCompressedFile(result.blob);
      setStats({
        originalSize: result.originalSize,
        size: result.size,
        width: result.width,
        height: result.height,
      });

      setStatus(STATUS.VALID);
    } catch (err) {
      console.error("[photo-upload] error:", err);
      setStatus(STATUS.ERROR);
      setErrorMessage(err?.message || "Could not process this image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const retake = () => {
    if (saving) return;
    resetAll();
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleSave = async () => {
    if (!compressedFile || !user) return;
    if (status !== STATUS.VALID) return;

    setSaving(true);
    setSaveError("");

    try {
      await uploadProfilePhoto(user.id, compressedFile, user.status);
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("[photo-upload] save error:", err);
      const pbData = err?.response?.data || {};
      const message =
        pbData.photo?.message ||
        err?.response?.message ||
        err?.message ||
        "Could not save your photo. Please try again.";
      setSaveError(message);
      setSaving(false);
    }
  };

  const isBusy = status === STATUS.ANALYZING || status === STATUS.COMPRESSING;

  return (
    <section className="photo-upload section">
      <div className="container-narrow photo-upload__container">
        <Link to="/profile" className="photo-upload__back">
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <Card variant="glass" size="lg" withTab glow="pink">
          <PillTab floating position="center" variant="primary">
            Photo verification
          </PillTab>

          <header className="photo-upload__header">
            <h1 className="type-h3 photo-upload__title">
              Upload a photo of your face
            </h1>
            <p className="type-body photo-upload__subtitle">
              One photo. One face. It stays on our servers and it's only used
              to confirm you're a real person joining the guild.
            </p>
          </header>

          {/* ---------- PREVIEW ---------- */}
          <div
            className={`photo-upload__preview photo-upload__preview--${status}`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Your photo"
                className="photo-upload__preview-img"
              />
            ) : (
              <div className="photo-upload__preview-empty">
                <div className="photo-upload__preview-icon">
                  <Camera size={32} />
                </div>
                <p className="photo-upload__preview-label">No photo yet</p>
                <p className="photo-upload__preview-hint">
                  Upload a file or take a photo to see it here.
                </p>
              </div>
            )}

            {status === STATUS.ANALYZING && (
              <div className="photo-upload__overlay photo-upload__overlay--info">
                <Loader2 size={20} className="photo-upload__spinner" />
                <span>Checking for a face…</span>
              </div>
            )}

            {status === STATUS.COMPRESSING && (
              <div className="photo-upload__overlay photo-upload__overlay--info">
                <Loader2 size={20} className="photo-upload__spinner" />
                <span>Compressing…</span>
              </div>
            )}

            {status === STATUS.VALID && (
              <div className="photo-upload__overlay photo-upload__overlay--success">
                <CheckCircle2 size={20} />
                <span>1 face detected — looks good</span>
              </div>
            )}

            {status === STATUS.NO_FACE && (
              <div className="photo-upload__overlay photo-upload__overlay--error">
                <XCircle size={20} />
                <span>No face found in this photo</span>
              </div>
            )}

            {status === STATUS.MULTIPLE_FACES && (
              <div className="photo-upload__overlay photo-upload__overlay--error">
                <AlertTriangle size={20} />
                <span>{faceCount} faces detected — please upload only you</span>
              </div>
            )}

            {status === STATUS.ERROR && (
              <div className="photo-upload__overlay photo-upload__overlay--error">
                <XCircle size={20} />
                <span>{errorMessage || "Could not analyse this image"}</span>
              </div>
            )}
          </div>

          {/* ---------- STATS ---------- */}
          {status === STATUS.VALID && stats && (
            <div className="photo-upload__stats">
              <span className="photo-upload__stats-item">
                {formatBytes(stats.originalSize)}
                {" → "}
                <strong>{formatBytes(stats.size)}</strong>
              </span>
              <span className="photo-upload__stats-divider" aria-hidden="true" />
              <span className="photo-upload__stats-item">
                {stats.width} × {stats.height}
              </span>
            </div>
          )}

          {/* ---------- SAVE ERROR ---------- */}
          {saveError && (
            <div className="photo-upload__save-error" role="alert">
              <XCircle size={16} />
              <span>{saveError}</span>
            </div>
          )}

          {/* ---------- ACTIONS ---------- */}
          <div className="photo-upload__actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFilePicked}
              style={{ display: "none" }}
            />

            {status === STATUS.IDLE || status === STATUS.ERROR ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<Upload size={18} />}
                  onClick={openFilePicker}
                  disabled={saving}
                >
                  Upload a photo
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leftIcon={<Camera size={18} />}
                  onClick={openFilePicker}
                  disabled={saving}
                >
                  Take a photo
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={retake}
                  disabled={isBusy || saving}
                >
                  Try a different photo
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSave}
                  loading={saving}
                  disabled={status !== STATUS.VALID}
                >
                  {saving ? "Saving…" : "Save this photo"}
                </Button>
              </>
            )}
          </div>

          {/* ---------- GUIDELINES ---------- */}
          <div className="photo-upload__guidelines">
            <div className="photo-upload__guidelines-head">
              <Info size={14} />
              <span>What makes a good photo</span>
            </div>
            <ul className="photo-upload__guidelines-list">
              <li>Exactly one face, clearly visible</li>
              <li>Face the camera directly — no sunglasses, no hats</li>
              <li>Good, even lighting</li>
              <li>No filters, no other people</li>
            </ul>
            <p className="photo-upload__note">
              This is a best-effort check that a face is present. It does not
              verify your identity. An admin can override if detection fails
              for a legitimate reason.
            </p>
          </div>
        </Card>

        <p className="photo-upload__identity type-caption">
          Uploading as {user?.email}
        </p>
      </div>
    </section>
  );
}