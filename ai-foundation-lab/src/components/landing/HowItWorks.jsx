// src/components/landing/HowItWorks.jsx
import LandingSection from "./LandingSection.jsx";
import PillTab from "../ui/PillTab.jsx";
import Timeline from "./Timeline.jsx";
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <LandingSection
      id="how-it-works"
      containerWidth="lg"
      paddingTop="xl"
      paddingBottom="lg"
      reveal={false}
    >
      <header className="hiw__header">
        <PillTab variant="default" size="sm">
          How it works
        </PillTab>

        <h2 className="type-h2 hiw__title">
          Eight steps from{" "}
          <span className="type-gradient">curious to confirmed</span>.
        </h2>

        <p className="type-body-lg hiw__subtitle">
          No shortcuts, no anonymous entry. Every student moves through the
          same sequence — so the community stays serious and the work stays
          real.
        </p>
      </header>

      <Timeline />
    </LandingSection>
  );
}