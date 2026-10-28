// src/pages/manual/StudentJourney.jsx
import { AlertCircle } from "lucide-react";
import ProgressTracker from "../../components/ui/ProgressTracker.jsx";
import Card from "../../components/ui/Card.jsx";

export default function StudentJourney() {
  return (
    <div className="manual-page">
      <header className="manual-page__header">
        <h1 className="manual-page__title">The Student Journey</h1>
        <p className="manual-page__subtitle">
          From registration to certification, here is the exact sequence of steps you will take.
        </p>
      </header>

      <Card variant="glass" size="lg" style={{ overflowX: "auto", paddingBottom: "var(--space-4)" }}>
        <ProgressTracker currentState="REGISTERED" />
      </Card>

      <div className="manual-prose">
        <h3>1. Registration & Verification</h3>
        <p>
          You will register with your real name and email. We will send you a verification link. Click it within 24 hours. After that, your account sits in <strong>Pending Approval</strong>.
        </p>

        <h3>2. Admin Approval</h3>
        <p>
          Unlike other platforms, we manually approve every human. This keeps the guild small, serious, and safe from bots. Once approved, you can upload your photo.
        </p>

        <h3>3. Photo Verification</h3>
        <p>
          You must upload a clear, well-lit photo of exactly one face. Our system (running entirely in your browser) will detect if a face is present. Once verified, you unlock the community.
        </p>
        
        <div className="manual-callout manual-callout--warning">
          <AlertCircle size={20} />
          <div>
            <strong>Important:</strong> If you do not upload a photo, you cannot access the Telegram group, and you cannot access the Exam Gate.
          </div>
        </div>

        <h3>4. The Exam Gate</h3>
        <p>
          When an exam window opens, the admin drops a magic link into the Telegram group. Clicking that link takes you to the <strong>Exam Gate</strong>. You must re-enter your email and password to claim your token. This confirms your identity and generates your timed exam session.
        </p>

        <h3>5. Results & Certification</h3>
        <p>
          After you submit, an admin will mark your code manually. When it is released, your dashboard will show your score. If you score high enough, you can instantly download your Certificate of Examination and Admission Letter as a PDF.
        </p>
      </div>
    </div>
  );
}