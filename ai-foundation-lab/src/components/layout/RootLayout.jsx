// src/components/layout/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./RootLayout.css";

export default function RootLayout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}