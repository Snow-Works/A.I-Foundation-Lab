// src/components/pdf/ResultSheet.jsx
import React from "react";
import LogoMark from "../ui/LogoMark.jsx";
import "./pdf-styles.css";

const ResultSheet = React.forwardRef(({ data }, ref) => {
  const { student, attempt, questions, totalScore, maxScore, passed } = data;
  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email;

  return (
    <div ref={ref} className="pdf-page">
      {/* Watermark */}
      <div className="pdf-watermark">
        <LogoMark size={400} />
      </div>

      <div className="pdf-content">
        <header className="pdf-header">
          <div className="pdf-brand">AI Foundation Lab</div>
          <div className="pdf-doc-title">Official Exam Transcript</div>
        </header>

        <section className="pdf-student-info">
          <h2>{fullName}</h2>
          <p>Email: {student.email}</p>
          <p>Date: {new Date(attempt.updated).toLocaleDateString()}</p>
        </section>

        <section className="pdf-score-summary">
          <div className={`pdf-status ${passed ? "pdf-status--pass" : "pdf-status--fail"}`}>
            {passed ? "PASSED" : "FAILED"}
          </div>
          <div className="pdf-total-score">
            Final Score: <strong>{totalScore}</strong> / {maxScore}
          </div>
        </section>

        <section className="pdf-breakdown">
          <h3>Question Breakdown</h3>
          {questions.map((q) => (
            <div key={q.attempt_question_id} className="pdf-q-row">
              <div className="pdf-q-header">
                <strong>Q{q.order}: {q.question.title}</strong>
                <span>{q.mark?.score || 0} / 10</span>
              </div>
              <pre className="pdf-code">{q.answer || "No answer provided."}</pre>
              {q.mark?.comment && (
                <p className="pdf-comment"><strong>Feedback:</strong> {q.mark.comment}</p>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
});

export default ResultSheet;