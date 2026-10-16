// src/components/exam/QuestionPanel.jsx
import { BookOpen } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";

/**
 * QuestionPanel — displays the prompt for one question and
 * provides a CodeMirror editor for the student's answer.
 */
export default function QuestionPanel({
  question,
  index,
  total,
  value,
  onChange,
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
      </div>
    </article>
  );
}