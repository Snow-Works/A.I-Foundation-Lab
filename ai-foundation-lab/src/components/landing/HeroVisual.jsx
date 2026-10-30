// src/components/landing/HeroVisual.jsx
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Floating } from "../ui/motion.js";
import { PortraitPlaceholder, RocketSVG, RobotSVG } from "./HeroShapes.jsx";
import "./HeroVisual.css";

/*  Founder portrait  */
function FounderPortrait() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <PortraitPlaceholder className="hero-visual__portrait-inner" />;
  }

  return (
    <img
      src="/assets/founder.webp"
      alt="Williams Adaji-Agbane, founder of AI Foundation Lab"
      className="hero-visual__portrait-inner"
      onError={() => setFailed(true)}
      loading="eager"
      decoding="async"
    />
  );
}

/*  Rocket — prefers /assets/rocket.webp  */
function RocketGraphic() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <RocketSVG className="hero-visual__rocket-svg" />;
  }

  return (
    <img
      src="/assets/rocket.webp"
      alt=""
      className="hero-visual__rocket-svg"
      onError={() => setFailed(true)}
      loading="eager"
      decoding="async"
    />
  );
}

/* Robot — prefers /assets/robot.webp */
function RobotGraphic() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <RobotSVG className="hero-visual__robot-svg" />;
  }

  return (
    <img
      src="/assets/robot.webp"
      alt=""
      className="hero-visual__robot-svg"
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function HeroVisual() {
  const prefersReduced = useReducedMotion();

  const containerVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.18, delayChildren: 0.2 },
        },
      };

  const portraitVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, x: -40 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const accentVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, scale: 0.85 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
        },
      };

  return (
    <motion.div
      className="hero-visual"
      aria-hidden="true"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="hero-visual__portrait" variants={portraitVariants}>
        <div className="hero-visual__glow" />
        <div className="hero-visual__portrait-frame">
          <FounderPortrait />
        </div>
      </motion.div>

      <motion.div className="hero-visual__rocket" variants={accentVariants}>
        <Floating amplitude={6} duration={4.2}>
          <RocketGraphic />
        </Floating>
      </motion.div>

      <motion.div className="hero-visual__robot" variants={accentVariants}>
        <RobotGraphic />
      </motion.div>
    </motion.div>
  );
}