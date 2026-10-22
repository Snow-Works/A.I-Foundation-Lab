// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import LogoMark from "../../components/ui/LogoMark.jsx";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/roster", label: "Roster", icon: UserCheck },
  { to: "/admin/submissions", label: "Submissions", icon: FileText },
  { to: "/admin/questions", label: "Questions", icon: FileText },
  { to: "/admin/violations", label: "Violations", icon: ShieldAlert },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect if we are in the marking screen (e.g. /admin/submissions/abc123)
  const isMarkingPage = /^\/admin\/submissions\/.+/.test(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}
      >
        <div className="admin-sidebar__header">
          <Link to="/admin" className="admin-sidebar__brand">
            <LogoMark size={28} style={{ color: "var(--white)" }} />
            <span>Admin Console</span>
          </Link>
          <button
            className="admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={14} className="admin-nav-item__arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user-badge">
            <div className="admin-user-avatar">
              {admin?.name?.[0] || "A"}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{admin?.name}</span>
              <span className="admin-user-role">{admin?.role}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {/* Hide the topbar and padding if we are marking an exam */}
        {!isMarkingPage ? (
          <>
            <header className="admin-topbar">
              <button
                className="admin-menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div className="admin-topbar__breadcrumb">Admin Dashboard</div>
            </header>
            <div className="admin-content">
              <Outlet />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
             <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}