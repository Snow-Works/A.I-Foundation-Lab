// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  Send,
  AtSign,
  Briefcase,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import LogoMark from "../ui/LogoMark.jsx";
import "./RootLayout.css";

/* ---------- Link groups ---------- */
const GROUPS = [
  {
    title: "The Lab",
    links: [
      { label: "Mission", href: "#mission" },
      { label: "Vision", href: "#vision" },
      { label: "Who is it for?", href: "#who-for" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "The Founder",
    links: [
      { label: "About Williams", href: "#founder" },
      { label: "FAQ", href: "#faq" },
      { label: "Style guide", to: "/style-guide" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#", disabled: true },
      { label: "Terms", href: "#", disabled: true },
      { label: "Contact", href: "mailto:hello@aifoundationlab.com" },
    ],
  },
];

/* ---------- Socials (using generic lucide icons) ---------- */
const SOCIALS = [
  {
    label: "Telegram community",
    Icon: Send,
    href: null,
  },
  {
    label: "X / Twitter",
    Icon: AtSign,
    href: null,
  },
  {
    label: "LinkedIn",
    Icon: Briefcase,
    href: null,
  },
  {
    label: "GitHub",
    Icon: Code2,
    href: null,
  },
];

/* ---------- Anchor smooth-scroll handler ---------- */
function handleAnchorClick(e, href) {
  if (!href || !href.startsWith("#")) return;
  if (href === "#") {
    e.preventDefault();
    return;
  }
  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

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

          <ul className="footer__socials" aria-label="Social links">
            {SOCIALS.map(({ label, Icon, href }) => {
              const disabled = !href;
              return (
                <li key={label}>
                  {disabled ? (
                    <span
                      className="footer__social footer__social--disabled"
                      title={`${label} — coming soon`}
                      aria-disabled="true"
                    >
                      <Icon size={16} />
                      <span className="sr-only">{label} — coming soon</span>
                    </span>
                  ) : (
                    <a
                      href={href}
                      className="footer__social"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon size={16} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- LINK GROUPS ---------- */}
        <nav className="footer__groups" aria-label="Footer">
          {GROUPS.map(({ title, links }) => (
            <div key={title} className="footer__group">
              <h3 className="footer__group-title">{title}</h3>
              <ul className="footer__group-list">
                {links.map((link) => {
                  if (link.disabled) {
                    return (
                      <li key={link.label}>
                        <span className="footer__link footer__link--disabled">
                          {link.label}
                        </span>
                      </li>
                    );
                  }
                  if (link.to) {
                    return (
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
                    );
                  }
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="footer__link"
                        onClick={(e) => handleAnchorClick(e, link.href)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ---------- BOTTOM BAR ---------- */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright type-caption">
            © {year} AI Foundation Lab · Built & Engineered by Snow Works (Michael Samuel)
          </p>
          <p className="footer__credit type-caption">
            Snow Works - Developer
          </p>
        </div>
      </div>
    </footer>
  );
}