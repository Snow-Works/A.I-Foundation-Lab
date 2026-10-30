// src/pages/Admin/AdminStatus.jsx
import { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { getSystemStatus, forceSweepStalledExams } from "../../services/adminStatusService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminStatus.css";

export default function AdminStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sweeping, setSweeping] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSystemStatus();
      setStatus(data);
    } catch (err) {
      console.error("[admin-status] error:", err);
      setError("Could not load system status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSweep = async () => {
    setSweeping(true);
    try {
      const res = await forceSweepStalledExams();
      alert(`Sweep complete. Closed ${res.swept} stalled exam(s).`);
      await fetchStatus();
    } catch (err) {
      console.error("[admin-status] sweep error:", err);
      alert("Failed to sweep stalled exams.");
    } finally {
      setSweeping(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-status__loading">
        <Loader2 size={24} className="admin-status__spinner" />
        <span>Loading system status…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-status__error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const { totalStudents, totalAttempts, activeExams, stalledExams } = status;

  return (
    <div className="admin-status">
      <header className="admin-status__header">
        <div>
          <h1 className="admin-status__title">System Status</h1>
          <p className="admin-status__subtitle">
            Live health and metrics of the platform.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={fetchStatus}
            disabled={loading || sweeping}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckCircle2 size={14} />}
            onClick={handleSweep}
            loading={sweeping}
          >
            Sweep Stalled Exams
          </Button>
        </div>
      </header>

      <div className="admin-status__grid">
        <Card variant="glass" size="md" glow="cyan" className="admin-status__card">
          <div className="admin-status__card-icon" style={{ color: "var(--cyan-400)" }}>
            <Users size={24} />
          </div>
          <div className="admin-status__card-value">{totalStudents}</div>
          <div className="admin-status__card-label">Total Students</div>
        </Card>

        <Card variant="glass" size="md" glow="pink" className="admin-status__card">
          <div className="admin-status__card-icon" style={{ color: "var(--pink-400)" }}>
            <Activity size={24} />
          </div>
          <div className="admin-status__card-value">{activeExams}</div>
          <div className="admin-status__card-label">Active Exams Right Now</div>
        </Card>

        <Card variant="glass" size="md" glow="orange" className="admin-status__card">
          <div className="admin-status__card-icon" style={{ color: "var(--orange-500)" }}>
            <FileText size={24} />
          </div>
          <div className="admin-status__card-value">{totalAttempts}</div>
          <div className="admin-status__card-label">Total Exam Attempts</div>
        </Card>

        <Card variant="glass" size="md" className={`admin-status__card ${stalledExams > 0 ? "admin-status__card--warning" : ""}`}>
          <div className="admin-status__card-icon" style={{ color: stalledExams > 0 ? "#FF6B6B" : "var(--text-muted)" }}>
            <ShieldAlert size={24} />
          </div>
          <div className="admin-status__card-value">{stalledExams}</div>
          <div className="admin-status__card-label">Stalled Exams (Expired)</div>
          {stalledExams > 0 && (
            <p className="admin-status__card-warning">
              These sessions are past their deadline and were not submitted. Click "Sweep" above to clean them.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}