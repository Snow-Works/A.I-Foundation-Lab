// src/components/landing/Hero.jsx
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import Wordmark from "../ui/Wordmark.jsx";
import Button from "../ui/Button.jsx";
import { Stagger, StaggerItem } from "../ui/motion.js";
import HeroBackground from "./HeroBackground.jsx";
import HeroVisual from "./HeroVisual.jsx";
import "./Hero.css";

export default function Hero() {
  const scrollToHowItWorks = () => {
    const target = document.getElementById("how-it-works");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero">
      <HeroBackground />

      <div className="hero__inner container">
        <div className="hero__visual-col">
          <HeroVisual />
        </div>

        <Stagger staggerDelay={0.10} className="hero__content">
          <StaggerItem>
            <Wordmark
              width={520}
              className="hero__wordmark"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </StaggerItem>

          <StaggerItem>
            <p className="hero__tagline">
              A guild for students who already code. Build and apply AI inside
              your own academic discipline.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="hero__ctas">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                as={Link}
                to="/style-guide"
              >
                Register
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<BookOpen size={18} />}
                onClick={scrollToHowItWorks}
              >
                How it works
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <p className="hero__trust">
              Not a beginner course · Working programming ability required
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}