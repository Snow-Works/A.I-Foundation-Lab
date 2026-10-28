// src/pages/Admin/AdminDashboard.jsx
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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import {
  getDashboardStats,
  getRecentSubmissions,
  getAnalyticsData
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

const COLORS = ["#2EC8FF", "#FF3FA4", "#F2511F", "#8A2FD0", "#5B2BD6"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [s, subs, a] = await Promise.all([
          getDashboardStats(),
          getRecentSubmissions(5),
          getAnalyticsData(),
        ]);
        if (cancelled) return;
        setStats(s);
        setSubmissions(subs.items);
        setAnalytics(a);
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

  // Custom tooltip styling to match dark theme
  const tooltipStyle = {
    backgroundColor: "rgba(10, 6, 48, 0.95)",
    borderColor: "var(--glass-border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--white)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--fs-sm)",
  };

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

      {/* ---------- CHARTS ---------- */}
      {analytics && (
        <div className="admin-dashboard__charts-grid">
          
          {/* Signups Over Time */}
          <Card variant="glass" size="md" className="admin-chart-card admin-chart-card--wide">
            <h3 className="admin-chart-card__title">Signups (Last 30 Days)</h3>
            <div style={{ width: "100%", height: 250, marginTop: "var(--space-4)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.signups} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} itemStyle={{ color: "#2EC8FF" }} />
                  <Line type="monotone" dataKey="count" stroke="#2EC8FF" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#2EC8FF", stroke: "#0A0630", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pass/Fail Donut */}
          <Card variant="glass" size="md" className="admin-chart-card">
            <h3 className="admin-chart-card__title">Pass vs Fail</h3>
            <div style={{ width: "100%", height: 250, marginTop: "var(--space-4)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.passFail}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.passFail.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#2EC8FF" : "#FF3FA4"} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="admin-chart-card__legend">
              <span><span className="dot" style={{ background: "#2EC8FF" }}></span> Passed ({analytics.passFail[0]?.value || 0})</span>
              <span><span className="dot" style={{ background: "#FF3FA4" }}></span> Failed ({analytics.passFail[1]?.value || 0})</span>
            </div>
          </Card>

          {/* Violations Bar Chart */}
          <Card variant="glass" size="md" className="admin-chart-card">
            <h3 className="admin-chart-card__title">Top Violations</h3>
            <div style={{ width: "100%", height: 250, marginTop: "var(--space-4)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.violations} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="count" fill="#F2511F" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      )}

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