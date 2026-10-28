// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X as CloseIcon, User as UserIcon, Trophy } from "lucide-react";
import LogoMark from "../ui/LogoMark.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./RootLayout.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link
          to="/"
          className="navbar__brand"
          aria-label="AI Foundation Lab — home"
          onClick={() => setMobileOpen(false)}
        >
          <LogoMark size={32} style={{ color: "var(--white)" }} />
          <span className="navbar__brand-text type-ui-strong">
            AI Foundation Lab
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink
            to="/style-guide"
            className={({ isActive }) =>
              `navbar__link type-ui ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Lab guide
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `navbar__link type-ui ${isActive ? "navbar__link--active" : ""}`
              }
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Trophy size={14} />
              Leaderboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `navbar__link type-ui ${isActive ? "navbar__link--active" : ""}`
              }
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <UserIcon size={14} />
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `navbar__link type-ui ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Log in
            </NavLink>
          )}

          {!isAuthenticated && (
            <Button variant="primary" size="sm" as={Link} to="/register">
              Register
            </Button>
          )}
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <CloseIcon size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile" aria-label="Mobile primary">
          <div
            className="container"
            style={{ display: "grid", gap: "var(--space-4)" }}
          >
            <NavLink
              to="/style-guide"
              className="navbar__mobile-link type-h4"
              onClick={() => setMobileOpen(false)}
            >
              Lab guide
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/leaderboard"
                className="navbar__mobile-link type-h4"
                onClick={() => setMobileOpen(false)}
              >
                Leaderboard
              </NavLink>
            )}

            {isAuthenticated ? (
              <NavLink
                to="/profile"
                className="navbar__mobile-link type-h4"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="navbar__mobile-link type-h4"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </NavLink>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  as={Link}
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}