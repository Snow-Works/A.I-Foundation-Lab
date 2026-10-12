// src/pages/PhotoUpload.jsx
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Camera,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { detectFacesInFile } from "../lib/faceDetector.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import Button from "../components/ui/Button.jsx";
import "./PhotoUpload.css";

/* ------------------------------------------------------------
   Status of the current photo
   ------------------------------------------------------------ */
const STATUS = {
  IDLE: "idle",
  ANALYZING: "analyzing",
  VALID: "valid",
  NO_FACE: "no_face",
  MULTIPLE_FACES: "multiple_faces",
  ERROR: "error",
};

export default function PhotoUpload() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [status, setStatus] = useState(STATUS.IDLE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [faceCount, setFaceCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFaceCount(0);
    setErrorMessage("");
    setStatus(STATUS.ANALYZING);

    try {
      const { count } = await detectFacesInFile(file);

      setFaceCount(count);

      if (count === 0) {
        setStatus(STATUS.NO_FACE);
      } else if (count > 1) {
        setStatus(STATUS.MULTIPLE_FACES);
      } else {
        setStatus(STATUS.VALID);
      }
    } catch (err) {
      console.error("[photo-upload] detection error:", err);
      setStatus(STATUS.ERROR);
      setErrorMessage(err?.message || "Face detection failed.");
    } finally {
      // Allow the same file to be picked again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFaceCount(0);
    setErrorMessage("");
    setStatus(STATUS.IDLE);
    fileInputRef.current?.click();
  };

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
          <div className={`photo-upload__preview photo-upload__preview--${status}`}>
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

            {/* Status overlay */}
            {status === STATUS.ANALYZING && (
              <div className="photo-upload__overlay photo-upload__overlay--info">
                <Loader2 size={20} className="photo-upload__spinner" />
                <span>Checking for a face…</span>
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
                >
                  Upload a photo
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leftIcon={<Camera size={18} />}
                  onClick={openFilePicker}
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
                  disabled={status === STATUS.ANALYZING}
                >
                  Try a different photo
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={status !== STATUS.VALID}
                >
                  Save this photo
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