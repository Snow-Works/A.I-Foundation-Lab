// src/pages/admin/AdminResults.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Award, Loader2, RefreshCw, AlertTriangle, Calendar, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { listMarkedResults } from "../../services/adminMarkingService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminResults.css";

const TABS = [
  { id: "all", label: "All Results" },
  { id: "passed", label: "Passed (Certified)" },
  { id: "failed", label: "Failed" },
];

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMarkedResults();
      setResults(data);
    } catch (err) {
      console.error("[admin-results] error:", err);
      setError(err?.response?.message || "Could not load results.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const filteredResults = results.filter((r) => {
    if (activeTab === "passed") return r.passed;
    if (activeTab === "failed") return !r.passed;
    return true;
  });

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString([], { dateStyle: 'medium' });
  };

  return (
    <div className="admin-results">
      <header className="admin-results__header">
        <div>
          <h1 className="admin-results__title">Results & Certifications</h1>
          <p className="admin-results__subtitle">
            Review final exam scores and pass/fail status.
          </p>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchResults} disabled={loading}>
          Refresh
        </Button>
      </header>

      <div className="admin-results__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-results__tab ${activeTab === tab.id ? "admin-results__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="admin-results__tab-count">
              {tab.id === "all" ? results.length : tab.id === "passed" ? results.filter(r => r.passed).length : results.filter(r => !r.passed).length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="admin-results__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <Card variant="glass" size="md" className="admin-results__card">
        {loading ? (
          <div className="admin-results__loading">
            <Loader2 size={24} className="admin-results__spinner" />
            <span>Loading results…</span>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="admin-results__empty">
            <Award size={32} />
            <p>No results found for this tab.</p>
          </div>
        ) : (
          <div className="admin-results__table-wrap">
            <table className="admin-results__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Total Score</th>
                  <th>Result</th>
                  <th>Released On</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => {
                  const student = r.expand?.student || {};
                  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email || "Unknown";
                  
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="admin-res-student">
                          <span className="admin-res-name">{fullName}</span>
                          <span className="admin-res-email">{student.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-res-score">
                          <span className="admin-res-score-num">{r.totalScore}</span>
                          <span className="admin-res-score-max">/ {r.maxScore}</span>
                        </div>
                      </td>
                      <td>
                        {r.passed ? (
                          <span className="badge badge--cyan"><CheckCircle2 size={12}/> Passed</span>
                        ) : (
                          <span className="badge badge--red"><XCircle size={12}/> Failed</span>
                        )}
                      </td>
                      <td>
                        <span className="admin-res-date">
                          <Calendar size={12} /> {formatDate(r.updated)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/submissions/${r.id}`} className="admin-res-view-btn">
                          View Details <ChevronRight size={14} />
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