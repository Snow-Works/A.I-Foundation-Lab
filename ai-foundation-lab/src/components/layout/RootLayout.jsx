// src/components/layout/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./RootLayout.css";

export default function RootLayout() {
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