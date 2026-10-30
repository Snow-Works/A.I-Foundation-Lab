// src/pages/Landing.jsx
import Hero from "../components/landing/Hero.jsx";
import MissionVision from "../components/landing/MissionVision.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import Founder from "../components/landing/Founder.jsx";
import FAQ from "../components/landing/FAQ.jsx";
import FinalCTA from "../components/landing/FinalCTA.jsx";
import { GradientDefs } from "../components/ui/icons";
import "../components/landing/Landing.css";

export default function Landing() {
  return (
    <>
      <GradientDefs />

      <Hero />

      <MissionVision />

      <HowItWorks />

      <Founder />

      <FAQ />

      <FinalCTA />
    </>
  );
}