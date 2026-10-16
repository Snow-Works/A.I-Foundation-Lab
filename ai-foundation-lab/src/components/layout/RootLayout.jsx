// src/components/layout/RootLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./RootLayout.css";

export default function RootLayout() {
  const location = useLocation();
  const isFullBleed = location.pathname.startsWith("/exam/session");

  if (isFullBleed) {
    return (
      <div className="app-shell app-shell--full">
        <main className="app-main app-main--full">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}