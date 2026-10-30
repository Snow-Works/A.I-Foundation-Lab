// src/pages/manual/ExamEnvironment.jsx
import { Code2, Play, Save, MonitorPlay } from "lucide-react";
import Card from "../../components/ui/Card.jsx";

export default function ExamEnvironment() {
  return (
    <div className="manual-page">
      <header className="manual-page__header">
        <h1 className="manual-page__title">The Exam Environment</h1>
        <p className="manual-page__subtitle">
          A breakdown of the interface. Familiarize yourself with this before you begin.
        </p>
      </header>

      <div className="manual-prose">
        <h3>The Toolbar (Top)</h3>
        <p>
          At the top of your screen, you will see the timer counting down, your save status, and a progress indicator showing how many questions you have answered. The timer turns orange at 5 minutes, and red at 1 minute.
        </p>

        <div className="manual-callout manual-callout--info">
          <Save size={20} />
          <div>
            <strong>Auto-Save:</strong> You do not need to click save. Your code automatically saves every 15 seconds, and every time you switch questions. If your browser crashes, your code is safe on our servers.
          </div>
        </div>

        <h3>The Question Panel (Left)</h3>
        <p>
          You can jump between any of the 25 questions using the sidebar. A green checkmark will appear next to any question you have answered.
        </p>

        <h3>The Editor & Python Runner (Center)</h3>
        <p>
          This is where you write your Python code. The editor has syntax highlighting and auto-indentation.
        </p>
        
        <Card variant="strong" size="md" style={{ marginBottom: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", color: "var(--cyan-400)" }}>
            <Play size={16} /> <strong>The "Run Code" Button</strong>
          </div>
          <p className="type-body-sm" style={{ margin: 0 }}>
            You are allowed to test your code! We have integrated the actual Python engine (Pyodide) directly into your browser. When you click "Run Code", it executes your script and shows the output in a terminal below the editor. This does not affect your final submission.
          </p>
        </Card>

        <h3>Submitting</h3>
        <p>
          When you are done, click the **Submit** button in the top right. You can also just let the timer run out—the system will automatically submit your final code for you.
        </p>
      </div>
    </div>
  );
}