// src/pages/admin/AdminAudit.jsx
import { useState, useEffect, useCallback } from "react";
import { Activity, Search, Loader2, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle, Calendar } from "lucide-react";
import { listAuditLogs } from "../../services/adminAuditService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminAudit.css";

const ACTION_TYPES = [
  { value: "all", label: "All Actions" },
  { value: "approved_user", label: "User Approved" },
  { value: "rejected_user", label: "User Rejected" },
  { value: "released_results", label: "Results Released" },
  { value: "created_question", label: "Question Created" },
  { value: "deleted_question", label: "Question Deleted" },
];

const ACTION_BADGES = {
  approved_user: "cyan",
  rejected_user: "red",
  released_results: "purple",
  created_question: "orange",
  deleted_question: "red",
};

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listAuditLogs({ page, perPage, search, actionFilter });
      setLogs(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("[admin-audit] error:", err);
      setError(err?.response?.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleFilterChange = (val) => {
    setActionFilter(val);
    setPage(1);
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  const startIdx = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalItems);

  return (
    <div className="admin-audit">
      <header className="admin-audit__header">
        <div>
          <h1 className="admin-audit__title">Audit Trail</h1>
          <p className="admin-audit__subtitle">
            A permanent record of all admin actions on the platform.
          </p>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchLogs} disabled={loading}>
          Refresh
        </Button>
      </header>

      <div className="admin-audit__filters">
        <form className="admin-audit__search" onSubmit={handleSearchSubmit}>
          <Search size={16} className="admin-audit__search-icon" />
          <input
            type="text"
            className="admin-audit__search-input"
            placeholder="Search admin, action, or ID…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="admin-audit__search-submit">
            Search
          </button>
        </form>

        <div className="admin-audit__chips">
          {ACTION_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`admin-audit__chip ${actionFilter === opt.value ? "admin-audit__chip--active" : ""}`}
              onClick={() => handleFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="admin-audit__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <Card variant="glass" size="md" className="admin-audit__card">
        {loading ? (
          <div className="admin-audit__loading">
            <Loader2 size={24} className="admin-audit__spinner" />
            <span>Loading logs…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="admin-audit__empty">
            <Activity size={32} />
            <p>No audit logs found matching this filter.</p>
          </div>
        ) : (
          <div className="admin-audit__table-wrap">
            <table className="admin-audit__table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target / Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="admin-audit__actor">{log.actor}</span>
                    </td>
                    <td>
                      <span className={`badge badge--${ACTION_BADGES[log.action] || 'silver'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="admin-audit__target">
                        <span className="admin-audit__target-id">{log.target_type} ID: {log.target_id}</span>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <span className="admin-audit__details">{JSON.stringify(log.details)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="admin-audit__date">
                        <Calendar size={12} /> {formatDate(log.occurred_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!loading && totalItems > 0 && (
        <div className="admin-audit__pagination">
          <span>Showing {startIdx}–{endIdx} of {totalItems}</span>
          <div className="admin-audit__pagination-buttons">
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