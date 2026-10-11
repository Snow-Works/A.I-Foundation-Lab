// src/pages/Landing.jsx
import Hero from "../components/landing/Hero.jsx";
import LandingSection from "../components/landing/LandingSection.jsx";
import Placeholder from "../components/landing/Placeholder.jsx";
import { GradientDefs } from "../components/ui/icons";
import "../components/landing/Landing.css";

export default function Landing() {
    return (
        <>
            <GradientDefs />

            <Hero />

            <LandingSection id="mission" containerWidth="lg" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="Mission"
                    desc="To give students who are already proficient in programming a guild through which to build and apply AI to their academic fields of study."
                    id="mission"
                />
            </LandingSection>

            <LandingSection id="vision" containerWidth="lg" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="Vision"
                    desc="To build a community of students who can build and apply artificial intelligence to their respective academic fields."
                    id="vision"
                />
            </LandingSection>

            <LandingSection id="who-for" containerWidth="lg" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="Who is the Lab for?"
                    desc="The qualifier — states clearly this is NOT for beginners."
                    id="who-for"
                />
            </LandingSection>

            <LandingSection id="how-it-works" containerWidth="lg" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="How it works"
                    desc="The 8-step journey rendered as a visual timeline."
                    id="how-it-works"
                    height="60vh"
                />
            </LandingSection>

            <LandingSection id="founder" containerWidth="lg" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="Founder"
                    desc="Williams Adaji-Agbane — signature, bio, portrait."
                    id="founder"
                />
            </LandingSection>

            <LandingSection id="faq" containerWidth="md" paddingTop="lg" paddingBottom="lg">
                <Placeholder
                    title="FAQ"
                    desc="Collapsible glass cards."
                    id="faq"
                    height="40vh"
                />
            </LandingSection>

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