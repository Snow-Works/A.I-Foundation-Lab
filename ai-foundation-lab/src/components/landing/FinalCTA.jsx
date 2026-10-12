// src/components/landing/FinalCTA.jsx
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import Wordmark from "../ui/Wordmark.jsx";
import Button from "../ui/Button.jsx";
import { Reveal, Floating, GlowPulse } from "../ui/motion.js";
import { RocketSVG } from "./HeroShapes.jsx";
import "./FinalCTA.css";

export default function FinalCTA() {
  const scrollToHowItWorks = () => {
    const target = document.getElementById("how-it-works");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="final-cta" className="final-cta">
        <section id="final-cta" className="final-cta">
  <h2 className="sr-only">Ready to join the AI Foundation Lab</h2>

  {/* ... rest unchanged ... */}
</section>
      {/* Layered background — mirrors the hero */}
      <div className="final-cta__bg" aria-hidden="true">
        <div className="final-cta__gradient" />
        <div className="final-cta__glow final-cta__glow--pink" />
        <div className="final-cta__glow final-cta__glow--cyan" />
        <svg
          className="final-cta__pattern"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cta-hex-dots"
              x="0"
              y="0"
              width="40"
              height="69.28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="0" cy="0" r="1.1" fill="currentColor" />
              <circle cx="40" cy="0" r="1.1" fill="currentColor" />
              <circle cx="0" cy="69.28" r="1.1" fill="currentColor" />
              <circle cx="40" cy="69.28" r="1.1" fill="currentColor" />
              <circle cx="20" cy="34.64" r="1.1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-hex-dots)" />
        </svg>
        <div className="final-cta__fade final-cta__fade--top" />
        <div className="final-cta__fade final-cta__fade--bottom" />
      </div>

      {/* Content */}
      <div className="final-cta__content">
        <Reveal variant="fadeUp">
          <div className="final-cta__wordmark-wrap">
            <Wordmark
              width={340}
              className="final-cta__wordmark"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Floating
              amplitude={6}
              duration={4.2}
              className="final-cta__rocket"
            >
              <RocketSVG className="final-cta__rocket-svg" />
            </Floating>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.15}>
          <p className="final-cta__line">
            If you already code, the next step is{" "}
            <span className="final-cta__line-emph">to build something</span>.
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.3}>
          <div className="final-cta__actions">
            <GlowPulse color="rgba(46, 200, 255, 0.55)">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                as={Link}
                to="/register"
                className="final-cta__register-btn"
              >
                Register
              </Button>
            </GlowPulse>

            <Button
              variant="ghost"
              size="lg"
              leftIcon={<BookOpen size={18} />}
              onClick={scrollToHowItWorks}
              className="final-cta__ghost-btn"
            >
              How it works
            </Button>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.45}>
          <p className="final-cta__trust">
            Free to join · Working programming ability required
          </p>
        </Reveal>
      </div>
    </section>
  );
}