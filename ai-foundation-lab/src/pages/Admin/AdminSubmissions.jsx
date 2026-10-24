// src/pages/admin/AdminSubmissions.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FileText, Loader2, RefreshCw, ChevronRight, AlertTriangle, Calendar, CheckCircle2, Eye } from "lucide-react";
import { listSubmissions } from "../../services/adminMarkingService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminSubmissions.css";

const STATUS_BADGES = {
  submitted: { label: "Needs Marking", cls: "badge--orange" },
  marked: { label: "Marked", cls: "badge--cyan" },
  released: { label: "Released", cls: "badge--pink" },
  terminated: { label: "Terminated", cls: "badge--red" },
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listSubmissions({ page: 1, perPage: 100 });
      setSubmissions(result.items);
    } catch (err) {
      console.error("[admin-submissions] error:", err);
      setError(err?.response?.message || "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="admin-submissions">
      <header className="admin-submissions__header">
        <div>
          <h1 className="admin-submissions__title">Submissions</h1>
          <p className="admin-submissions__subtitle">
            Review all student exam attempts.
          </p>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchSubmissions} disabled={loading}>
          Refresh
        </Button>
      </header>

      {error && (
        <div className="admin-submissions__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <Card variant="glass" size="md" className="admin-submissions__card">
        {loading ? (
          <div className="admin-submissions__loading">
            <Loader2 size={24} className="admin-submissions__spinner" />
            <span>Loading submissions…</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="admin-submissions__empty">
            <FileText size={32} />
            <p>No submissions found.</p>
          </div>
        ) : (
          <div className="admin-submissions__table-wrap">
            <table className="admin-submissions__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const student = sub.expand?.student || {};
                  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email || "Unknown";
                  const initials = (student.first_name?.[0] || "?") + (student.surname?.[0] || "");
                  const badge = STATUS_BADGES[sub.status] || { label: sub.status, cls: "badge--silver" };
                  const isMarked = sub.status === "marked" || sub.status === "released";

                  return (
                    <tr key={sub.id}>
                      <td>
                        <div className="admin-sub-student">
                          <div className="admin-sub-avatar">{initials}</div>
                          <div>
                            <span className="admin-sub-name">{fullName}</span>
                            <span className="admin-sub-email">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-sub-date">
                          <Calendar size={12} /> {formatDate(sub.submitted_at || sub.created)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td>
                        <Link to={`/admin/submissions/${sub.id}`} className={`admin-sub-mark-btn ${isMarked ? 'admin-sub-mark-btn--view' : ''}`}>
                          {isMarked ? (
                            <><Eye size={14} /> View Results</>
                          ) : (
                            <><CheckCircle2 size={14} /> Mark Exam</>
                          )}
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}