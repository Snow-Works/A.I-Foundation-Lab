// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LogoMark from "../ui/LogoMark.jsx";
import "./RootLayout.css";

/* ---------- Custom Social SVGs ---------- */
const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const MeetUsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

/* ---------- Link groups ---------- */
const GROUPS = [
  {
    title: "The Lab",
    links: [
      { label: "Mission", to: "/about#mission" },
      { label: "Vision", to: "/about#vision" },
      { label: "Who is it for?", to: "/about#who-for" },
      { label: "How it works", to: "/about#how-it-works" },
    ],
  },
  {
    title: "The Team",
    links: [
      { label: "About Williams", to: "/team" },
      { label: "Meet the CTO", to: "/team" },
      { label: "FAQ", to: "/faq" },
      { label: "Lab Manual", to: "/manual" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/legal" },
      { label: "Terms", to: "/legal" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

/* ---------- Socials ---------- */
const SOCIALS = [
  { label: "LinkedIn", Icon: LinkedInIcon, href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "Facebook", Icon: FacebookIcon, href: "#" },
  { label: "MeetUs (Community)", Icon: MeetUsIcon, href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container container">
        {/* ---------- BRAND BLOCK ---------- */}
        <div className="footer__brand">
          <Link
            to="/"
            className="footer__brand-link"
            aria-label="AI Foundation Lab — home"
          >
            <LogoMark size={32} style={{ color: "var(--white)" }} />
            <span className="footer__brand-name">AI Foundation Lab</span>
          </Link>

          <p className="footer__tagline">
            A guild for students who already code. Build and apply AI inside
            your own academic discipline.
          </p>

          <p className="footer__signature" aria-hidden="true">
            Williams Adaji-Agbane
          </p>
          <p className="footer__role type-caption">Founder</p>
          
          <p className="footer__signature" aria-hidden="true" style={{ marginTop: "var(--space-2)" }}>
            Snow Works
          </p>
          <p className="footer__role type-caption">Chief Technology Officer</p>

          <ul className="footer__socials" aria-label="Social links">
            {SOCIALS.map(({ label, Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer__social"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- LINK GROUPS ---------- */}
        <nav className="footer__groups" aria-label="Footer">
          {GROUPS.map(({ title, links }) => (
            <div key={title} className="footer__group">
              <h3 className="footer__group-title">{title}</h3>
              <ul className="footer__group-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer__link">
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="footer__link-arrow"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ---------- BOTTOM BAR ---------- */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright type-caption">
            © {year} AI Foundation Lab · Built & Engineered by Snow Works
          </p>
          <p className="footer__credit type-caption">
            Snow Works - Developer
          </p>
        </div>
      </div>
    </footer>
  );
}