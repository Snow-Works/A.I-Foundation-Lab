// src/components/layout/AuthDebug.jsx
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Temporary debug widget.
 * Shows auth state in the navbar so we can verify the context works.
 * Delete this component after Step 3.6.
 */
export default function AuthDebug() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <span className="type-caption" style={{ color: "var(--text-muted)" }}>
        auth…
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <span className="type-caption" style={{ color: "var(--text-muted)" }}>
        not signed in
      </span>
    );
  }

  return (
    <span
      className="type-caption"
      style={{
        color: "var(--cyan-400)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {user.email}
      <button
        type="button"
        onClick={logout}
        style={{
          background: "transparent",
          border: "1px solid var(--glass-border)",
          color: "inherit",
          padding: "2px 8px",
          borderRadius: "var(--radius-xs)",
          cursor: "pointer",
          fontSize: "inherit",
        }}
      >
        log out
      </button>
    </span>
  );
}