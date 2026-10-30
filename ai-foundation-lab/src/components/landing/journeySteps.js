// src/components/landing/journeySteps.js
import {
  RegisterIcon,
  VerifyIcon,
  ShieldCheckIcon,
  PhotoIcon,
  CommunityIcon,
  IdentityIcon,
  ExamIcon,
  ResultIcon,
} from "../ui/icons";

/**
 * The eight canonical steps of the AI Foundation Lab journey.
 * Order matters — this is the same sequence used by the progress
 * tracker on the profile page.
 */
export const JOURNEY_STEPS = [
  {
    key: "register",
    index: 1,
    label: "Register",
    title: "Create your account",
    description:
      "Sign up with the same full name you used for your school registration. Tell us who you are — accurately, once.",
    Icon: RegisterIcon,
    accent: "pink",
  },
  {
    key: "verify",
    index: 2,
    label: "Verify email",
    title: "Confirm your inbox",
    description:
      "We send a verification link to the email you register with. Click it to prove the address is yours.",
    Icon: VerifyIcon,
    accent: "magenta",
  },
  {
    key: "approve",
    index: 3,
    label: "Admin approval",
    title: "A human reviews your file",
    description:
      "An admin checks that your name, email, and profile match. This keeps the guild small and serious.",
    Icon: ShieldCheckIcon,
    accent: "violet",
  },
  {
    key: "photo",
    index: 4,
    label: "Photo check",
    title: "Upload a clear photo of your face",
    description:
      "One photo. One face. Best-effort detection runs in your browser before upload — no photo leaves your device until it passes.",
    Icon: PhotoIcon,
    accent: "cyan",
  },
  {
    key: "community",
    index: 5,
    label: "Join Telegram",
    title: "Unlock the community",
    description:
      "Once your photo is verified, the Telegram group link becomes available. This is where orientation happens.",
    Icon: CommunityIcon,
    accent: "cyan",
  },
  {
    key: "identity",
    index: 6,
    label: "Identity confirm",
    title: "Prove it's really you",
    description:
      "When an exam window opens, an admin releases a gate link into the group. Click it, log in again, and your identity is confirmed for that attempt.",
    Icon: IdentityIcon,
    accent: "pink",
  },
  {
    key: "exam",
    index: 7,
    label: "Take the exam",
    title: "The proctored Python exam",
    description:
      "Desktop or laptop only. Fullscreen required. Timed, watched, and logged. Coding questions drawn at random, hope you are ready?.",
    Icon: ExamIcon,
    accent: "magenta",
  },
  {
    key: "results",
    index: 8,
    label: "See results",
    title: "Marked & released when ready",
    description:
      "No auto-grading. WE mark every submission against a rubric. Your result is released when it's ready, not sooner.",
    Icon: ResultIcon,
    accent: "orange",
  },
];