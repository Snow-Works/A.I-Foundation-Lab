// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ProtectedRoute.css";

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Usage:
 *   <Route path="profile" element={
 *     <ProtectedRoute><Profile /></ProtectedRoute>
 *   } />
 *
 * Behaviour:
 *   - If the session is still loading → shows a small loader
 *   - If the user isn't logged in → redirects to /login,
 *     storing the current path so we can send them back after login
 *   - Otherwise → renders children
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still bootstrapping the session from localStorage → wait
  if (loading) {
    return (
      <div className="protected-loader">
        <span className="protected-loader__dot" />
        <span className="protected-loader__dot" />
        <span className="protected-loader__dot" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where they wanted to go so login can send them back
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Reserved for Phase 6 admin routes
  if (requireAdmin && user?.collectionName !== "admins") {
    return <Navigate to="/" replace />;
  }

  return children;
}