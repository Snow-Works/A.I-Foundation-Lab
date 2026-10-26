// src/components/exam/QuestionPanel.jsx
import { BookOpen, Play, Trash2, Loader2 } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import Button from "../ui/Button.jsx";

export default function QuestionPanel({
  question,
  index,
  total,
  value,
  onChange,
  pythonRunner,
}) {
  return (
    <article className="question-panel">
      <header className="question-panel__header">
        <div className="question-panel__meta">
          <span className="question-panel__num">
            Question {index + 1} of {total}
          </span>
          <span className="question-panel__difficulty">
            {question.difficulty}
          </span>
          {question.topic && (
            <span className="question-panel__topic">{question.topic}</span>
          )}
        </div>
        <h1 className="question-panel__title">{question.title}</h1>
      </header>

      <div className="question-panel__prompt-section">
        <div className="question-panel__section-label">
          <BookOpen size={14} aria-hidden="true" />
          <span>Prompt</span>
        </div>
        <div
          className="question-panel__prompt"
          dangerouslySetInnerHTML={{ __html: question.prompt }}
        />
      </div>

      <div className="question-panel__editor-section">
        <div className="question-panel__section-label">
          <span>Your solution</span>
        </div>
        <CodeEditor
          value={value}
          onChange={onChange}
          placeholder="Write your Python solution here…"
        />
        
        {/* Editor Actions */}
        <div className="question-panel__editor-actions">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              pythonRunner.status === "loading" || pythonRunner.status === "running" ? (
                <Loader2 size={14} className="admin-settings__spinner" />
              ) : (
                <Play size={14} />
              )
            }
            onClick={() => pythonRunner.runCode(value)}
            disabled={pythonRunner.status === "loading" || pythonRunner.status === "running"}
          >
            {pythonRunner.status === "loading" ? "Loading Python..." : 
             pythonRunner.status === "running" ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      {/* Output Console */}
      {(pythonRunner.output || pythonRunner.error) && (
        <div className="question-panel__terminal">
          <div className="question-panel__terminal-header">
            <span>Terminal Output</span>
            <button 
              type="button" 
              onClick={pythonRunner.clearOutput}
              className="question-panel__terminal-clear"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <pre className={`question-panel__terminal-body ${pythonRunner.error ? "question-panel__terminal-body--error" : ""}`}>
            {pythonRunner.error || pythonRunner.output}
          </pre>
        </div>
      )}
    </article>
  );
}