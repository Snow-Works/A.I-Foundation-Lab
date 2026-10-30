// src/pages/manual/RulesProctoring.jsx
import { ShieldAlert, Maximize, CopyX, Camera } from "lucide-react";

export default function RulesProctoring() {
  return (
    <div className="manual-page">
      <header className="manual-page__header">
        <h1 className="manual-page__title">Rules & Proctoring</h1>
        <p className="manual-page__subtitle" style={{ color: "#FF6B6B" }}>
          The exam is strictly proctored. Breaking these rules will result in immediate termination.
        </p>
      </header>

      <div className="manual-prose">
        <h3>The Golden Rule: Fullscreen</h3>
        <div className="manual-callout manual-callout--danger">
          <Maximize size={20} />
          <div>
            <strong>Exiting Fullscreen = Automatic Failure.</strong> The moment you click "Begin Exam", your browser enters fullscreen. If you press the Escape key, or if your browser kicks you out of fullscreen, the exam terminates instantly.
          </div>
        </div>

        <h3>The Two-Strike Rule</h3>
        <p>
          We know that sometimes you might accidentally click outside the window. So, we give you <strong>one</strong> warning.
        </p>
        <ul>
          <li><strong>Strike 1:</strong> You switch tabs, minimize the window, or lose focus. The screen blurs and a warning modal appears. You can dismiss it and continue.</li>
          <li><strong>Strike 2:</strong> You do it again. The exam terminates instantly. Your code is saved, but you cannot resume.</li>
        </ul>

        <h3>Copy, Paste & Right-Click</h3>
        <div className="manual-callout manual-callout--warning">
          <CopyX size={20} />
          <div>
            Copying, pasting, cutting, or right-clicking inside the code editor is disabled. Any attempt to use keyboard shortcuts (Cmd+C, Ctrl+V) will be logged as a violation.
          </div>
        </div>

        <h3>The Watermark</h3>
        <div className="manual-callout manual-callout--info">
          <Camera size={20} />
          <div>
            You will notice your email and a timestamp floating slowly across the screen. This is a dynamic watermark. Do not attempt to take a screenshot; the watermark is embedded in the pixels and will be traced back to you.
          </div>
        </div>

        <h3>Screen Recording</h3>
        <p>
          We do not record your camera. We do not record your screen. We only record the proctoring events (tab switching, copy/paste attempts). Be honest, write your code, and you have nothing to worry about.
        </p>
      </div>
    </div>
  );
}