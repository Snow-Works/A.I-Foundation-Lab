// src/pages/admin/AdminViolations.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Eye,
} from "lucide-react";
import { listViolations } from "../../services/adminViolationService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminViolations.css";

const VIOLATION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "tab_hidden", label: "Tab Switch" },
  { value: "window_blur", label: "Window Blur" },
  { value: "fullscreen_exit", label: "Fullscreen Exit" },
  { value: "copy", label: "Copy Attempt" },
  { value: "paste", label: "Paste Attempt" },
  { value: "screenshot_shortcut", label: "Screenshot Attempt" },
];

const TYPE_LABELS = {
  tab_hidden: "Tab Switch",
  window_blur: "Window Blur",
  fullscreen_exit: "Fullscreen Exit",
  copy: "Copy Attempt",
  paste: "Paste Attempt",
  cut: "Cut Attempt",
  context_menu: "Right Click",
  print_screen: "Print Screen",
  screenshot_shortcut: "Screenshot Attempt",
};

export default function AdminViolations() {
  const [violations, setViolations] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(30);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listViolations({ page, perPage, search, typeFilter });
      setViolations(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("[admin-violations] error:", err);
      setError(err?.response?.message || "Failed to load violations.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, typeFilter]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleTypeChange = (val) => {
    setTypeFilter(val);
    setPage(1);
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  const startIdx = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalItems);

  return (
    <div className="admin-violations">
      <header className="admin-violations__header">
        <div>
          <h1 className="admin-violations__title">Violations Log</h1>
          <p className="admin-violations__subtitle">
            Review proctoring events triggered during exam sessions.
          </p>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchViolations} disabled={loading}>
          Refresh
        </Button>
      </header>

      <div className="admin-violations__filters">
        <form className="admin-violations__search" onSubmit={handleSearchSubmit}>
          <Search size={16} className="admin-violations__search-icon" />
          <input
            type="text"
            className="admin-violations__search-input"
            placeholder="Search student name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="admin-violations__search-submit">
            Search
          </button>
        </form>

        <div className="admin-violations__chips">
          {VIOLATION_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`admin-violations__chip ${typeFilter === opt.value ? "admin-violations__chip--active" : ""}`}
              onClick={() => handleTypeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="admin-violations__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <Card variant="glass" size="md" className="admin-violations__card">
        {loading ? (
          <div className="admin-violations__loading">
            <Loader2 size={24} className="admin-violations__spinner" />
            <span>Loading log…</span>
          </div>
        ) : violations.length === 0 ? (
          <div className="admin-violations__empty">
            <ShieldAlert size={32} />
            <p>No violations found matching this filter.</p>
          </div>
        ) : (
          <div className="admin-violations__table-wrap">
            <table className="admin-violations__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Violation Event</th>
                  <th>Timestamp</th>
                  <th>Attempt Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => {
                  const student = v.expand?.student || {};
                  const attempt = v.expand?.attempt || {};
                  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email || "Unknown";
                  
                  return (
                    <tr key={v.id}>
                      <td>
                        <div className="admin-v-student">
                          <span className="admin-v-name">{fullName}</span>
                          <span className="admin-v-email">{student.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-v-type">
                          <span className="badge badge--red">{TYPE_LABELS[v.type] || v.type}</span>
                          {v.details && Object.keys(v.details).length > 0 && (
                            <span className="admin-v-details">{JSON.stringify(v.details)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="admin-v-date">
                          <Calendar size={12} /> {formatDate(v.occurred_at)}
                        </span>
                      </td>
                      <td>
                        {attempt.status === "terminated" ? (
                          <span className="badge badge--red">Terminated</span>
                        ) : attempt.status === "submitted" || attempt.status === "released" || attempt.status === "marked" ? (
                          <span className="badge badge--cyan">Submitted</span>
                        ) : (
                          <span className="badge badge--silver">{attempt.status}</span>
                        )}
                      </td>
                      <td>
                        <Link to={`/admin/submissions/${attempt.id}`} className="admin-v-action">
                          <Eye size={14} /> Review
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

      {!loading && totalItems > 0 && (
        <div className="admin-violations__pagination">
          <span>Showing {startIdx}–{endIdx} of {totalItems}</span>
          <div className="admin-violations__pagination-buttons">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              <ChevronLeft size={16} />
            </button>
            <span>{page} / {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}