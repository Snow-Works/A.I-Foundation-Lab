// src/pages/Team.jsx
import { useState } from "react";
import { Quote } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import "./InfoPages.css";

// Fallback placeholder for images
function PlaceholderAvatar() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--ink-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--cyan-400)", fontSize: "2rem", fontWeight: "bold" }}>Ai</span>
    </div>
  );
}

export default function Team() {
  const [founderError, setFounderError] = useState(false);
  const [ctoError, setCtoError] = useState(false);

  return (
    <section className="info-page section">
      <div className="container info-page__container">
        <header className="info-page__header">
          <h1 className="type-h1 info-page__title">The Minds Behind the Lab</h1>
          <p className="type-body-lg info-page__subtitle">
            Built with rigor, designed for the future.
          </p>
        </header>

        <div className="team-grid">
          {/* Founder */}
          <div className="team-card">
            <div className="team-card__image-wrap">
              {founderError ? (
                <PlaceholderAvatar />
              ) : (
                <img
                  src="/assets/design2.jpeg"
                  alt="Williams Adaji-Agbane"
                  className="team-card__image"
                  onError={() => setFounderError(true)}
                />
              )}
            </div>
            <h2 className="team-card__name">Williams Adaji-Agbane</h2>
            <span className="team-card__role">Founder</span>
            <p className="team-card__bio">
              Williams built the AI Foundation Lab because he watched too many brilliant programmers graduate without ever pointing their skills at a real problem. He believes that AI is the sharpest instrument for the next generation of scientists.
            </p>
          </div>

          {/* CTO */}
          <div className="team-card">
            <div className="team-card__image-wrap" style={{ background: "var(--gradient-cyan)" }}>
              {ctoError ? (
                <PlaceholderAvatar />
              ) : (
                <img
                  src="/assets/cto.webp"
                  alt="Snow Works"
                  className="team-card__image"
                  onError={() => setCtoError(true)}
                />
              )}
            </div>
            <h2 className="team-card__name">Snow Works</h2>
            <span className="team-card__role" style={{ color: "var(--cyan-400)" }}>Chief Technology Officer</span>
            <p className="team-card__bio">
              The architect behind the platform. Snow Works engineered the secure examination engine, the real-time proctoring systems, and the analytical dashboards that power the Lab. They ensure that the 240-year vision is built on a foundation of unbreakable code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}