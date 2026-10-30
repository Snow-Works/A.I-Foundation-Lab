// src/components/ui/ProgressTracker.jsx
import { motion, useReducedMotion } from "framer-motion";
import {
  RegisterIcon,
  VerifyIcon,
  IdentityIcon,
  PhotoIcon,
  CommunityIcon,
  ShieldCheckIcon,
  ExamIcon,
  ResultIcon,
} from "./icons/JourneyIcons.jsx";
import { Check } from "lucide-react";
import "./ProgressTracker.css";

/* Canonical step definitions */
/* Order matches the state machine from the spec. */
export const TRACKER_STEPS = [
  {
    key: "REGISTERED",
    label: "Registered",
    hint: "You've created your account.",
    Icon: RegisterIcon,
  },
  {
    key: "EMAIL_VERIFIED",
    label: "Email",
    hint: "Verify the email you registered with.",
    Icon: VerifyIcon,
  },
  {
    key: "APPROVED",
    label: "Approved",
    hint: "An admin has approved your registration.",
    Icon: ShieldCheckIcon,
  },
  {
    key: "PHOTO_VERIFIED",
    label: "Photo",
    hint: "Upload a clear photo of a single human face.",
    Icon: PhotoIcon,
  },
  {
    key: "COMMUNITY_UNLOCKED",
    label: "Community",
    hint: "Join the Telegram group.",
    Icon: CommunityIcon,
  },
  {
    key: "IDENTITY_CONFIRMED",
    label: "Identity",
    hint: "Re-confirm your credentials via the Exam Gate link.",
    Icon: IdentityIcon,
  },
  {
    key: "EXAM_IN_PROGRESS",
    label: "Exam",
    hint: "Take the proctored Python coding exam.",
    Icon: ExamIcon,
  },
  {
    key: "SUBMITTED",
    label: "Submitted",
    hint: "Your answers are stored for review.",
    Icon: VerifyIcon,
  },
  {
    key: "MARKED",
    label: "Results",
    hint: "Admins have marked and released your result.",
    Icon: ResultIcon,
  },
];

/* ------------------------------------------------------------
   normalizeDisplayStatus
   PHOTO_VERIFIED is displayed as COMMUNITY_UNLOCKED so the
   "Community" step shows as the student's current position
   instead of a stale "Photo" step. The stored status is
   unchanged — this is purely for the tracker UI.
   ------------------------------------------------------------ */
function normalizeDisplayStatus(status) {
  if (status === "PHOTO_VERIFIED") return "COMMUNITY_UNLOCKED";
  return status;
}

/* ------------------------------------------------------------
   computeCurrentIndex
   Returns the index of the step the user is currently on.
   - Known statuses → their own index.
   - PHOTO_VERIFIED → bumped to COMMUNITY_UNLOCKED (index 4).
   - REJECTED → pinned to APPROVED (index 2) where rejection
     occurred, so earlier steps still show as done.
   - Unknown → 0 (defensive).
   ------------------------------------------------------------ */
function computeCurrentIndex(status) {
  const normalized = normalizeDisplayStatus(status);
  const idx = TRACKER_STEPS.findIndex((s) => s.key === normalized);
  if (idx >= 0) return idx;
  if (status === "REJECTED") return 2;
  return 0;
}

/*  Utility: derive status for each step  */
function getStepStatus(stepIndex, currentIndex, overrides = {}) {
  const key = TRACKER_STEPS[stepIndex].key;
  if (overrides[key]) return overrides[key]; // e.g., "error"
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

/* ProgressTracker */
export default function ProgressTracker({
  currentState,
  overrides = {}, // e.g., { EMAIL_VERIFIED: "error" }
  orientation = "horizontal", // "horizontal" | "vertical" | "auto"
  className = "",
}) {
  const prefersReducedMotion = useReducedMotion();
  const currentIndex = computeCurrentIndex(currentState);

  const classes = [
    "tracker",
    orientation === "vertical" ? "tracker--vertical" : "tracker--horizontal",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.05 },
        },
      };

  const stepVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.ol
      className={classes}
      style={{ "--steps": TRACKER_STEPS.length }}
      aria-label="Application progress"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {TRACKER_STEPS.map((step, i) => {
        const status = getStepStatus(i, currentIndex, overrides);
        const showCheck = status === "done";
        const Icon = step.Icon;

        return (
          <motion.li
            key={step.key}
            className={`step step--${status}`}
            variants={stepVariants}
            aria-current={status === "active" ? "step" : undefined}
          >
            <span className="step__node" aria-hidden="true">
              {showCheck ? <Check strokeWidth={3} /> : <Icon />}
            </span>

            <span className="step__body">
              <span className="step__label">{step.label}</span>
              <span className="step__hint">{step.hint}</span>
            </span>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/* Compact variant for the profile header */
export function ProgressTrackerCompact({ currentState }) {
  const currentIndex = computeCurrentIndex(currentState);
  const current = TRACKER_STEPS[currentIndex];

  return (
    <div
      className="tracker tracker--compact"
      aria-label={`Progress: ${current.label}`}
    >
      <span className="compact-dots" aria-hidden="true">
        {TRACKER_STEPS.map((step, i) => (
          <span
            key={step.key}
            className={[
              "compact-dot",
              i < currentIndex && "compact-dot--done",
              i === currentIndex && "compact-dot--active",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </span>

      <span className="compact-label">{current.label}</span>
      <span className="compact-count">
        Step {currentIndex + 1} of {TRACKER_STEPS.length}
      </span>
    </div>
  );
}