// src/pages/manual/Welcome.jsx
import { Compass, Target, Zap } from "lucide-react";

export default function Welcome() {
  return (
    <div className="manual-page">
      <header className="manual-page__header">
        <h1 className="manual-page__title">Welcome to the Lab</h1>
        <p className="manual-page__subtitle">
          This is not a course. This is a guild for builders. Read this manual carefully—it is your guide to navigating the AI Foundation Lab.
        </p>
      </header>

      <div className="manual-prose">
        <h3>Our Standard</h3>
        <p>
          We built the AI Foundation Lab because we believe the next generation of great engineers will not just write code—they will apply artificial intelligence to their own academic disciplines. Biology, economics, linguistics, medicine.
        </p>
        <p>
          To maintain this standard, we require every student to prove their technical proficiency. This manual exists so you know exactly what to expect, how the platform works, and what to do if things go wrong.
        </p>

        <div className="manual-callout manual-callout--info">
          <Compass size={20} />
          <div>
            <strong>Your Journey Starts Here.</strong> Take 5 minutes to read through the tabs on the left. Understanding the environment before you take the exam will give you a massive advantage.
          </div>
        </div>

        <h3>What the Lab Provides</h3>
        <ul>
          <li><strong>A serious environment:</strong> A proctored, monitored Python coding exam.</li>
          <li><strong>A community:</strong> Access to Telegram groups for orientation and exam links.</li>
          <li><strong>Real recognition:</strong> If you pass, you receive a certified exam certificate and admission letter.</li>
        </ul>

        <h3>What the Lab Expects From You</h3>
        <ul>
          <li><strong>Working proficiency:</strong> You must already know how to code. We do not teach the basics.</li>
          <li><strong>Integrity:</strong> Your face must match your profile. You must not attempt to cheat the proctoring system.</li>
          <li><strong>Focus:</strong> The exam runs in fullscreen. Exiting fullscreen ends the exam.</li>
        </ul>
      </div>
    </div>
  );
}