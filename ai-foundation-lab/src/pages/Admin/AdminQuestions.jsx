// src/pages/admin/AdminQuestions.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";
import {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionActive,
} from "../../services/adminQuestionService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import AlertModal from "../../components/ui/AlertModal.jsx";
import QuestionFormModal from "../../components/admin/QuestionFormModal.jsx";
import "./AdminQuestions.css";

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk Import
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listQuestions({ page, perPage, search, difficulty });
      setQuestions(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("[admin-questions] fetch error:", err);
      setError(err?.response?.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDifficultyChange = (val) => {
    setDifficulty(val);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingQuestion(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (q) => {
    setEditingQuestion(q);
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, formData);
      } else {
        await createQuestion(formData);
      }
      setFormOpen(false);
      await fetchQuestions();
    } catch (err) {
      console.error("[admin-questions] save error:", err);
      setFormError(err?.response?.message || "Could not save question.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQuestion(deleteTarget.id);
      setDeleteTarget(null);
      await fetchQuestions();
    } catch (err) {
      console.error("[admin-questions] delete error:", err);
      setError(err?.response?.message || "Could not delete question.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (q) => {
    try {
      await toggleQuestionActive(q.id, !q.active);
      await fetchQuestions();
    } catch (err) {
      console.error("[admin-questions] toggle error:", err);
      setError("Could not update question status.");
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError("");

    try {
      const text = await file.text();
      const questions = JSON.parse(text);

      if (!Array.isArray(questions)) {
        throw new Error("JSON file must contain an array of questions.");
      }

      let created = 0;
      let failed = 0;

      for (const q of questions) {
        try {
          await createQuestion({
            title: q.title,
            prompt: q.prompt,
            difficulty: q.difficulty || "medium",
            topic: q.topic || "",
            rubric: q.rubric || "",
            sample_solution: q.sample_solution || "",
            active: q.active !== false,
          });
          created++;
        } catch (err) {
          console.error("Failed to import:", q.title, err);
          failed++;
        }
      }

      alert(`Import complete!\nSuccessfully imported: ${created}\nFailed: ${failed}`);
      await fetchQuestions();
    } catch (err) {
      console.error("[bulk-import] error:", err);
      setError(err?.message || "Failed to parse or import the JSON file.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const startIdx = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalItems);

  return (
    <div className="admin-questions">
      <header className="admin-questions__header">
        <div>
          <h1 className="admin-questions__title">Question Bank</h1>
          <p className="admin-questions__subtitle">
            Manage the pool of questions used for exams.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleBulkImport}
            style={{ display: "none" }}
          />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Upload size={16} />}
            onClick={() => fileInputRef.current?.click()}
            loading={importing}
          >
            {importing ? "Importing…" : "Bulk Import"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={fetchQuestions}
            disabled={loading || importing}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={openCreateForm}
          >
            New Question
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="admin-questions__filters">
        <form className="admin-questions__search" onSubmit={handleSearchSubmit}>
          <Search size={16} className="admin-questions__search-icon" />
          <input
            type="text"
            className="admin-questions__search-input"
            placeholder="Search title or topic…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="admin-questions__search-submit">
            Search
          </button>
        </form>

        <div className="admin-questions__chips">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`admin-questions__chip ${difficulty === opt.value ? "admin-questions__chip--active" : ""}`}
              onClick={() => handleDifficultyChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="admin-questions__error">
          <XCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <Card variant="glass" size="md" className="admin-questions__card">
        {loading ? (
          <div className="admin-questions__loading">
            <Loader2 size={24} className="admin-questions__spinner" />
            <span>Loading questions…</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="admin-questions__empty">
            <FileText size={32} />
            <p>No questions found matching this filter.</p>
          </div>
        ) : (
          <div className="admin-questions__table-wrap">
            <table className="admin-questions__table">
              <thead>
                <tr>
                  <th>Title & Topic</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div className="admin-q-info">
                        <span className="admin-q-title">{q.title}</span>
                        <span className="admin-q-topic">{q.topic || "No topic"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge--${q.difficulty === 'easy' ? 'cyan' : q.difficulty === 'medium' ? 'orange' : 'red'}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`admin-q-status ${q.active ? "admin-q-status--active" : "admin-q-status--inactive"}`}
                        onClick={() => handleToggleActive(q)}
                        title="Toggle Active"
                      >
                        {q.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {q.active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td>
                      <div className="admin-q-actions">
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => openEditForm(q)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn admin-action-btn--danger"
                          onClick={() => setDeleteTarget(q)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!loading && totalItems > 0 && (
        <div className="admin-questions__pagination">
          <span>Showing {startIdx}–{endIdx} of {totalItems}</span>
          <div className="admin-questions__pagination-buttons">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>←</button>
            <span>{page} / {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>→</button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <QuestionFormModal
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        onSave={handleSave}
        question={editingQuestion}
        saving={saving}
        error={formError}
      />

      {/* Delete Modal */}
      <AlertModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        tone="danger"
        title="Delete this question?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed from the bank.`
            : ""
        }
        confirmLabel={deleting ? "Deleting…" : "Delete permanently"}
        onConfirm={handleDelete}
        showCancel
        closeOnBackdrop={!deleting}
        closeOnEsc={!deleting}
      />
    </div>
  );
}