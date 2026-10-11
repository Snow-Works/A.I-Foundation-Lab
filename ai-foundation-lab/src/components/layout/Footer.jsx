// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import LogoMark from "../ui/LogoMark.jsx";
import "./RootLayout.css";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer__inner">
                <div className="footer__brand">
                    <LogoMark size={28} style={{ color: "var(--white)" }} />
                    <span className="type-ui-strong">AI Foundation Lab</span>
                </div>

                <nav className="footer__nav" aria-label="Footer">
                    <Link to="/" className="type-body-sm">Home</Link>
                    <Link to="/style-guide" className="type-body-sm">Style guide</Link>
                </nav>

                <p className="type-caption footer__copyright">
                    © {year} AI Foundation Lab · Founded by Williams Adaji-Agbane
                </p>
            </div>
        </footer>
    );
}