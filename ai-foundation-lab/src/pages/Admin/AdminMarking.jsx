// src/pages/admin/AdminMarking.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, Loader2, Save, Award, Send } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { getSubmissionDetails, saveMark, releaseResults } from "../../services/adminMarkingService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Field, Input, Textarea } from "../../components/ui/Form.js";
import AlertModal from "../../components/ui/AlertModal.jsx";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "./AdminMarking.css";

export default function AdminMarking() {
  const { attemptId } = useParams();
  const { admin } = useAdminAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  // Mark form state
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Release modal
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getSubmissionDetails(attemptId);
        if (!cancelled) setData(res);
      } catch (err) {
        console.error("[admin-marking] error:", err);
        if (!cancelled) setError("Could not load submission details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [attemptId]);

  // Update form when switching questions
  useEffect(() => {
    if (!data || !data.questions[activeIdx]) return;
    const q = data.questions[activeIdx];
    setScore(q.mark ? q.mark.score : "");
    setComment(q.mark ? q.mark.comment : "");
    setSaveError("");
    setSaveSuccess("");
  }, [data, activeIdx]);

  const handleSaveMark = async () => {
    if (!data) return;
    const q = data.questions[activeIdx];

    if (score === "" || Number(score) < 0) {
      setSaveError("Please enter a valid score.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      await saveMark({
        attemptQuestionId: q.attempt_question_id,
        adminId: admin.id,
        score: Number(score),
        maxScore: 10, // Hardcoded max score for now
        comment,
      });

      // Update local state so we don't need to refetch
      const newQuestions = [...data.questions];
      newQuestions[activeIdx].mark = { score: Number(score), comment };

      setData({ ...data, questions: newQuestions });
      setSaveSuccess("Mark saved.");
      setTimeout(() => setSaveSuccess(""), 2000);
    } catch (err) {
      console.error("[admin-marking] save error:", err);
      setSaveError("Failed to save mark.");
    } finally {
      setSaving(false);
    }
  };

  const handleRelease = async () => {
    if (!data) return;
    setReleasing(true);
    try {
      await releaseResults(data.attempt.id, data.student.id);
      // Redirect back to list
      window.location.href = "/#/admin/submissions";
    } catch (err) {
      console.error("[admin-marking] release error:", err);
      setReleasing(false);
      setReleaseOpen(false);
      setError("Failed to release results.");
    }
  };

  if (loading) {
    return (
      <div className="admin-marking__loading">
        <Loader2 size={24} className="admin-marking__spinner" />
        <span>Loading submission…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-marking__error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const currentQ = data.questions[activeIdx];
  const allMarked = data.questions.every((q) => q.mark !== null);

  return (
    <div className="admin-marking">
      <header className="admin-marking__header">
        <Link to="/admin/submissions" className="admin-marking__back">
          <ArrowLeft size={16} /> Back to submissions
        </Link>
        <div className="admin-marking__student-info">
          <h1 className="admin-marking__title">Marking: {data.student.first_name} {data.student.surname}</h1>
          <span className="admin-marking__meta">Attempt ID: {data.attempt.id}</span>
        </div>
        <div className="admin-marking__actions">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send size={16} />}
            onClick={() => setReleaseOpen(true)}
            disabled={!allMarked}
          >
            {allMarked ? "Release Results" : "Mark all questions to release"}
          </Button>
        </div>
      </header>

      <div className="admin-marking__layout">
        {/* LEFT: Question List */}
        <aside className="admin-marking__sidebar">
          <h3 className="admin-marking__sidebar-title">Questions</h3>
          <ul className="admin-marking__qlist">
            {data.questions.map((q, i) => (
              <li key={q.attempt_question_id}>
                <button
                  type="button"
                  className={`admin-marking__qitem ${activeIdx === i ? "admin-marking__qitem--active" : ""}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <span className="admin-marking__qnum">Q{q.order}</span>
                  <span className="admin-marking__qname">{q.question.title}</span>
                  {q.mark ? (
                    <CheckCircle2 size={16} className="admin-marking__qcheck" />
                  ) : (
                    <div className="admin-marking__qdot" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN: Content */}
        <main className="admin-marking__main">
          <div className="admin-marking__grid">
            {/* Question & Rubric */}
            <div className="admin-marking__panel">
              <div className="admin-marking__section-head">
                <h2 className="admin-marking__section-title">Question {currentQ.order}</h2>
                <span className={`badge badge--${currentQ.question.difficulty === 'easy' ? 'cyan' : currentQ.question.difficulty === 'medium' ? 'orange' : 'red'}`}>
                  {currentQ.question.difficulty}
                </span>
              </div>
              <div className="admin-marking__prompt" dangerouslySetInnerHTML={{ __html: currentQ.question.prompt }} />
              
              <div className="admin-marking__rubric">
                <h4 className="admin-marking__rubric-title">Marking Rubric</h4>
                <p className="admin-marking__rubric-text">{currentQ.question.rubric || "No rubric provided."}</p>
              </div>
              
              <div className="admin-marking__sample">
                <h4 className="admin-marking__sample-title">Sample Solution</h4>
                <pre className="admin-marking__code-block">{currentQ.question.sample_solution || "No sample solution."}</pre>
              </div>
            </div>

            {/* Student Answer & Score */}
            <div className="admin-marking__panel">
              <div className="admin-marking__section-head">
                <h2 className="admin-marking__section-title">Student Answer</h2>
              </div>
              
              <div className="admin-marking__answer-box">
                <CodeMirror
                  value={currentQ.answer || "# No answer provided"}
                  height="300px"
                  theme="dark"
                  extensions={[python()]}
                  readOnly={true}
                />
              </div>

              <div className="admin-marking__grade-box">
                <div className="admin-marking__grade-row">
                  <Field label="Score (out of 10)" required error={saveError}>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Comment (optional)">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Feedback for the student…"
                    minRows={2}
                  />
                </Field>
                <div className="admin-marking__grade-actions">
                  {saveSuccess && <span className="admin-marking__save-success">{saveSuccess}</span>}
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Save size={16} />}
                    onClick={handleSaveMark}
                    loading={saving}
                  >
                    Save Mark
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AlertModal
        open={releaseOpen}
        onClose={() => !releasing && setReleaseOpen(false)}
        tone="success"
        title="Release results to student?"
        description="This will finalize the exam. The student will see their marks and feedback on their profile. You cannot undo this action."
        confirmLabel={releasing ? "Releasing…" : "Release Results"}
        onConfirm={handleRelease}
        showCancel
        closeOnBackdrop={!releasing}
        closeOnEsc={!releasing}
      />
    </div>
  );
}