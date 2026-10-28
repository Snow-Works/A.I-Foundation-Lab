// src/pages/Legal.jsx
import { useState } from "react";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import "./InfoPages.css";

export default function Legal() {
  const [tab, setTab] = useState("privacy");

  return (
    <section className="info-page section">
      <div className="container info-page__container">
        <header className="info-page__header">
          <h1 className="type-h1 info-page__title">Legal</h1>
          <p className="type-body-lg info-page__subtitle">
            Transparency and integrity.
          </p>
        </header>

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", marginBottom: "var(--space-5)" }}>
          <PillTab
            interactive
            variant={tab === "privacy" ? "primary" : "default"}
            onClick={() => setTab("privacy")}
          >
            Privacy Policy
          </PillTab>
          <PillTab
            interactive
            variant={tab === "terms" ? "primary" : "default"}
            onClick={() => setTab("terms")}
          >
            Terms of Service
          </PillTab>
        </div>

        <Card variant="glass" size="lg">
          <div className="info-page__content" style={{ paddingTop: "var(--space-4)" }}>
            {tab === "privacy" ? (
              <>
                <h3>1. Data We Collect</h3>
                <p>We collect your name, email address, WhatsApp number, and a profile photo. We also store the code you submit during exams and the timestamps of your actions.</p>
                
                <h3>2. How We Use It</h3>
                <p>Your data is used strictly for identity verification, exam proctoring, grading, and platform communication. We do not sell, rent, or share your data with third-party advertisers.</p>

                <h3>3. Biometric Data & Face Detection</h3>
                <p>Our photo verification uses Google MediaPipe, which runs <strong>entirely in your browser</strong>. Your raw camera feed is never sent to our servers. We only store the final, compressed image you upload.</p>

                <h3>4. Security</h3>
                <p>All data is stored on secure servers using industry-standard encryption. Access to your data is strictly limited to authorized administrators.</p>
              </>
            ) : (
              <>
                <h3>1. Exam Integrity</h3>
                <p>By taking an exam, you agree to the proctoring rules. Exiting fullscreen, switching tabs, or attempting to copy/paste will result in immediate termination. Two strikes will fail your exam.</p>
                
                <h3>2. Account Suspension</h3>
                <p>We reserve the right to suspend or permanently ban accounts that attempt to hack, exploit, or disrupt the platform. We also reserve the right to revoke certificates if cheating is discovered post-examination.</p>

                <h3>3. Certification</h3>
                <p>Certificates are issued based on the manual grading of our administrators. The Lab is the sole arbiter of what constitutes a passing grade.</p>

                <h3>4. Changes to Terms</h3>
                <p>We may update these terms as the platform evolves. Continued use of the platform constitutes acceptance of the new terms.</p>
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}