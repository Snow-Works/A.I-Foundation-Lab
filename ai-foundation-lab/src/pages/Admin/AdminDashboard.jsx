// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  AlertTriangle,
  FileText,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentSubmissions,
} from "../../services/adminDashboardService.js";
import Card from "../../components/ui/Card.jsx";
import PillTab from "../../components/ui/PillTab.jsx";
import "./AdminDashboard.css";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [s, subs] = await Promise.all([
          getDashboardStats(),
          getRecentSubmissions(5),
        ]);
        if (cancelled) return;
        setStats(s);
        setSubmissions(subs.items);
      } catch (err) {
        console.error("[admin-dashboard] error:", err);
        if (!cancelled) {
          setError(err?.response?.message || "Could not load dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard__loading">
        <Loader2 size={28} className="admin-dashboard__spinner" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard__error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const cards = [
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Users,
      tone: "cyan",
      to: "/admin/users",
      cta: "View all",
    },
    {
      label: "Pending approvals",
      value: stats.pendingUsers,
      icon: CheckSquare,
      tone: "orange",
      to: "/admin/users",
      cta: "Approve students",
    },
    {
      label: "Needs marking",
      value: stats.pendingMarking,
      icon: FileText,
      tone: "pink",
      to: "/admin/submissions",
      cta: "Mark submissions",
    },
    {
      label: "Violations (24h)",
      value: stats.recentViolations,
      icon: AlertTriangle,
      tone: "red",
      to: "/admin/violations",
      cta: "View log",
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Overview</h1>
          <p className="admin-dashboard__subtitle">
            Live snapshot of the guild.
          </p>
        </div>
      </header>

      {/* ---------- STATS ---------- */}
      <div className="admin-dashboard__grid">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`admin-stat-card admin-stat-card--${c.tone}`}
          >
            <div className="admin-stat-card__icon">
              <c.icon size={22} />
            </div>
            <div className="admin-stat-card__value">{c.value}</div>
            <div className="admin-stat-card__label">{c.label}</div>
            <Link to={c.to} className="admin-stat-card__cta">
              {c.cta}
              <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>

      {/* ---------- RECENT SUBMISSIONS ---------- */}
      <Card variant="glass" size="md" withTab className="admin-dashboard__panel">
        <PillTab floating position="left" variant="default">
          Recent submissions
        </PillTab>

        {submissions.length === 0 ? (
          <p className="admin-dashboard__empty">
            No submissions waiting for marking. All caught up.
          </p>
        ) : (
          <ul className="admin-dashboard__submissions">
            {submissions.map((s) => {
              const student = s.expand?.student || {};
              const fullName =
                [student.first_name, student.surname]
                  .filter(Boolean)
                  .join(" ") || student.email || "Unknown";
              return (
                <li key={s.id} className="admin-dashboard__submission">
                  <div className="admin-dashboard__submission-info">
                    <span className="admin-dashboard__submission-name">
                      {fullName}
                    </span>
                    <span className="admin-dashboard__submission-meta">
                      <Calendar size={11} />
                      {formatDate(s.submitted_at)}
                    </span>
                  </div>
                  <Link
                    to={`/admin/submissions`}
                    className="admin-dashboard__submission-link"
                  >
                    Mark →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* ---------- QUICK LINKS ---------- */}
      <div className="admin-dashboard__quick">
        <Link to="/admin/users" className="admin-quick-link">
          <Users size={16} />
          <div>
            <span>Review users</span>
            <small>{stats.pendingUsers} pending approval</small>
          </div>
          <ArrowRight size={16} className="admin-quick-link__arrow" />
        </Link>

        <Link to="/admin/submissions" className="admin-quick-link">
          <FileText size={16} />
          <div>
            <span>Mark submissions</span>
            <small>{stats.pendingMarking} waiting</small>
          </div>
          <ArrowRight size={16} className="admin-quick-link__arrow" />
        </Link>

        <Link to="/admin/violations" className="admin-quick-link">
          <AlertTriangle size={16} />
          <div>
            <span>Violations log</span>
            <small>{stats.recentViolations} in the last 24h</small>
          </div>
          <ArrowRight size={16} className="admin-quick-link__arrow" />
        </Link>
      </div>
    </div>
  );
}