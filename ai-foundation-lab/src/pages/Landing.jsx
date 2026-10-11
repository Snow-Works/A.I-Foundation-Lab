// src/pages/Landing.jsx
import Hero from "../components/landing/Hero.jsx";
import MissionVision from "../components/landing/MissionVision.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import Founder from "../components/landing/Founder.jsx";
import LandingSection from "../components/landing/LandingSection.jsx";
import Placeholder from "../components/landing/Placeholder.jsx";
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

      {/* FAQ — real component in Step 2.9 */}
      <LandingSection id="faq" containerWidth="md" paddingTop="lg" paddingBottom="lg">
        <Placeholder
          title="FAQ"
          desc="Collapsible glass cards."
          id="faq"
          height="40vh"
        />
      </LandingSection>

      {/* Final CTA — real component in Step 2.10 */}
      <LandingSection
        id="final-cta"
        containerWidth="lg"
        paddingTop="lg"
        paddingBottom="xl"
        reveal={false}
      >
        <Placeholder
          title="Final CTA"
          desc="Full-bleed signature gradient panel with the Register button."
          id="final-cta"
        />
      </LandingSection>
    </>
  );
}