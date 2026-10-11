// src/components/landing/Founder.jsx
import { useState } from "react";
import { Quote } from "lucide-react";
import LandingSection from "./LandingSection.jsx";
import Card from "../ui/Card.jsx";
import PillTab from "../ui/PillTab.jsx";
import { Reveal } from "../ui/motion.js";
import { PortraitPlaceholder } from "./HeroShapes.jsx";
import "./Founder.css";

/* ---------- Portrait with graceful fallback ---------- */
function FounderPortrait() {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <PortraitPlaceholder className="founder__portrait-inner" />;
    }

    return (
        <img
            src="/assets/design2.jpeg"
            alt="Williams Adaji-Agbane, founder of AI Foundation Lab"
            className="founder__portrait-inner"
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            
        />
    );
}

export default function Founder() {
    return (
        <LandingSection
            id="founder"
            containerWidth="lg"
            paddingTop="xl"
            paddingBottom="lg"
            reveal={false}
        >
            <header className="founder__header">
                <PillTab variant="default" size="sm">
                    The Founder
                </PillTab>

                <h2 className="type-h2 founder__title">
                    Built by a Great Mind,{" "}
                    <span className="type-gradient">for students</span>.
                </h2>
            </header>

            <div className="founder__grid">
                {/* ---------- LEFT — Portrait ---------- */}
                <Reveal variant="slideInLeft" className="founder__portrait-col">
                    <div className="founder__portrait">
                        <div className="founder__glow" aria-hidden="true" />
                        <div className="founder__portrait-frame">
                            <FounderPortrait />

                        </div>
                    </div>
                </Reveal>

                {/* ---------- RIGHT — Signature, bio, quote ---------- */}
                <Reveal variant="slideInRight" delay={0.15} className="founder__content">
                    {/* Signature */}
                    <div className="founder__signature-wrap">
                        <span className="founder__signature" aria-hidden="true">
                            Williams
                        </span>
                        <span className="founder__surname">ADAJI-AGBANE</span>
                    </div>

                    {/* Bio */}
                    <div className="founder__bio">
                        <p className="type-body founder__bio-p">
                            I built the AI Foundation Lab because I watched too many
                            brilliant programmers graduate without ever pointing their
                            skills at a real problem. They could write code. They couldn't
                            yet build something that mattered.
                        </p>

                        <p className="type-body founder__bio-p">
                            This lab is the guild I wish I'd had: a small, serious group of
                            students who already know how to program, learning to apply
                            artificial intelligence inside their own disciplines: biology,
                            economics, linguistics, medicine, engineering, wherever their
                            curiosity already lives.
                        </p>

                        <p className="type-body founder__bio-p">
                            We don't teach you to code. We help you build something with the
                            code you already write.
                        </p>
                    </div>

                    {/* Quote callout */}
                    <Card variant="outline" size="sm" className="founder__quote-card">
                        <Quote
                            size={20}
                            className="icon-gradient founder__quote-icon"
                            aria-hidden="true"
                        />
                        <p className="founder__quote">
                            The point of AI isn't to replace the scientist. It's to give
                            them a sharper instrument and the confidence to use it.
                        </p>
                    </Card>
                </Reveal>
            </div>
        </LandingSection>
    );
}