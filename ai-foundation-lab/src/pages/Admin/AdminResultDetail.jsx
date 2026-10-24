// src/pages/admin/AdminResultDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Award, Loader2, AlertTriangle, User, Calendar, Mail } from "lucide-react";
import { getSubmissionDetails } from "../../services/adminMarkingService.js";
import Card from "../../components/ui/Card.jsx";
import "./AdminResultDetail.css";

export default function AdminResultDetail() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getSubmissionDetails(attemptId);
        if (!cancelled) setData(res);
      } catch (err) {
        console.error("[admin-result-detail] error:", err);
        if (!cancelled) setError("Could not load result details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="admin-result-detail__loading">
        <Loader2 size={24} className="admin-result-detail__spinner" />
        <span>Loading transcript…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-result-detail__error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const { student, attempt, questions } = data;
  
  // Calculate total score
  let totalScore = 0;
  let maxScore = 0;
  questions.forEach((q) => {
    if (q.mark) {
      totalScore += Number(q.mark.score) || 0;
      maxScore += 10; // Assuming max score per question is 10
    }
  });

  const PASS_MARK = 180;
  const passed = totalScore >= PASS_MARK;
  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email;

  return (
    <div className="admin-result-detail">
      <header className="admin-result-detail__header">
        <Link to="/admin/results" className="admin-result-detail__back">
          <ArrowLeft size={16} /> Back to Results
        </Link>
        <h1 className="admin-result-detail__title">Exam Transcript</h1>
      </header>

      <div className="admin-result-detail__container">
        {/* Student Info Card */}
        <Card variant="glass" size="lg" className="admin-result-detail__summary-card">
          <div className="admin-result-detail__student-info">
            <div className="admin-result-detail__avatar">
              {student.first_name?.[0]}{student.surname?.[0]}
            </div>
            <div>
              <h2 className="admin-result-detail__name">{fullName}</h2>
              <div className="admin-result-detail__meta">
                <span><Mail size={12} /> {student.email}</span>
                <span><Calendar size={12} /> Submitted: {new Date(attempt.updated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className={`admin-result-detail__score-block ${passed ? 'admin-result-detail__score-block--passed' : 'admin-result-detail__score-block--failed'}`}>
            <div className="admin-result-detail__score-icon">
              {passed ? <Award size={32} /> : <XCircle size={32} />}
            </div>
            <div className="admin-result-detail__score-text">
              <span className="admin-result-detail__score-label">Final Score</span>
              <div className="admin-result-detail__score-value">
                {totalScore} <span>/ {maxScore}</span>
              </div>
            </div>
            <div className={`admin-result-detail__status-badge ${passed ? 'admin-result-detail__status-badge--passed' : 'admin-result-detail__status-badge--failed'}`}>
              {passed ? "PASSED" : "FAILED"}
            </div>
          </div>
        </Card>

        {/* Question Breakdown */}
        <h3 className="admin-result-detail__section-title">Question Breakdown</h3>
        
        <div className="admin-result-detail__breakdown">
          {questions.map((q) => (
            <Card key={q.attempt_question_id} variant="glass" size="md" className="admin-result-detail__q-card">
              <div className="admin-result-detail__q-header">
                <div className="admin-result-detail__q-title-wrap">
                  <span className="admin-result-detail__q-num">Q{q.order}</span>
                  <h4 className="admin-result-detail__q-title">{q.question.title}</h4>
                </div>
                <div className="admin-result-detail__q-score">
                  <span className="admin-result-detail__q-score-val">{q.mark?.score || 0}</span>
                  <span className="admin-result-detail__q-score-max">/ 10</span>
                </div>
              </div>
              
              <div className="admin-result-detail__q-body">
                <div className="admin-result-detail__q-answer">
                  <span className="admin-result-detail__label">Student Answer</span>
                  <pre>{q.answer || "No answer provided."}</pre>
                </div>
                
                {q.mark?.comment && (
                  <div className="admin-result-detail__q-comment">
                    <span className="admin-result-detail__label">Admin Feedback</span>
                    <p>{q.mark.comment}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}