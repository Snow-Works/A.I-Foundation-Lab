// src/pages/style-guide/sections/Patterns.jsx
import { useState } from "react";
import { Rocket, Sparkles, Zap, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";
import Card from "../../../components/ui/Card.jsx";
import PillTab from "../../../components/ui/PillTab.jsx";
import ProgressTracker, {
    ProgressTrackerCompact,
    TRACKER_STEPS,
} from "../../../components/ui/ProgressTracker.jsx";
import {
    Reveal,
    Stagger,
    StaggerItem,
    Floating,
    GlowPulse,
} from "../../../components/ui/motion.js";
import { GradientDefs } from "../../../components/ui/icons";

export default function Patterns() {
    const [index, setIndex] = useState(4);
    const currentState = TRACKER_STEPS[index].key;

    return (
        <>
            <GradientDefs />

            {/* --- PROGRESS TRACKER --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Progress tracker</h2>
                    <p className="sg-section__desc">
                        The state-machine strip from REGISTERED to MARKED. Auto-switches to
                        vertical below 640px.
                    </p>
                </header>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
                    <Button size="sm" onClick={() => setIndex((i) => Math.min(i + 1, TRACKER_STEPS.length - 1))}>
                        Advance
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setIndex(1)}>
                        Simulate error at Email
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIndex(0)}>
                        Reset
                    </Button>
                </div>

                <Card variant="glass" size="lg" style={{ marginBottom: "var(--space-6)" }}>
                    <ProgressTracker
                        currentState={currentState}
                        overrides={index === 1 ? { EMAIL_VERIFIED: "error" } : {}}
                    />
                </Card>

                <h3 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}>
                    Vertical
                </h3>
                <Card variant="glass" size="lg" style={{ maxWidth: 560, marginBottom: "var(--space-6)" }}>
                    <ProgressTracker currentState={currentState} orientation="vertical" />
                </Card>

                <h3 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}>
                    Compact
                </h3>
                <Card variant="glass" size="md" withTab>
                    <PillTab floating position="center" variant="default">Your progress</PillTab>
                    <ProgressTrackerCompact currentState={currentState} />
                </Card>
            </section>

            {/* --- MOTION PRIMITIVES --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Motion primitives</h2>
                    <p className="sg-section__desc">
                        Reveal, Stagger, Floating, GlowPulse. Every animation in the app
                        comes from this library and respects prefers-reduced-motion.
                    </p>
                </header>

                <h3 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}>
                    Reveal — scroll into view
                </h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                        gap: "var(--space-4)",
                        marginBottom: "var(--space-6)",
                    }}
                >
                    <Reveal variant="fadeUp">
                        <Card variant="glass" size="md"><p className="type-body-sm">fadeUp</p></Card>
                    </Reveal>
                    <Reveal variant="scaleIn" delay={0.1}>
                        <Card variant="glass" size="md"><p className="type-body-sm">scaleIn</p></Card>
                    </Reveal>
                    <Reveal variant="slideInLeft" delay={0.2}>
                        <Card variant="glass" size="md"><p className="type-body-sm">slideInLeft</p></Card>
                    </Reveal>
                    <Reveal variant="slideInRight" delay={0.3}>
                        <Card variant="glass" size="md"><p className="type-body-sm">slideInRight</p></Card>
                    </Reveal>
                </div>

                <h3 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}>
                    Stagger — cascading entrance
                </h3>
                <Stagger
                    staggerDelay={0.08}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
                        gap: "var(--space-3)",
                        marginBottom: "var(--space-6)",
                    }}
                >
                    {["Register", "Verify", "Approve", "Photo", "Join", "Confirm", "Exam", "Result"].map((label) => (
                        <StaggerItem key={label}>
                            <Card variant="glass" size="sm">
                                <span className="type-body-sm">{label}</span>
                            </Card>
                        </StaggerItem>
                    ))}
                </Stagger>

                <h3 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-3)" }}>
                    Floating &amp; GlowPulse
                </h3>
                <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", alignItems: "center" }}>
                    <Floating amplitude={10} duration={4}>
                        <Rocket size={40} className="icon-gradient" />
                    </Floating>
                    <Floating amplitude={6} duration={3} delay={0.3}>
                        <Sparkles size={28} className="icon-gradient-cyan" />
                    </Floating>
                    <Floating amplitude={8} duration={5} delay={0.6}>
                        <Zap size={24} className="icon-gradient" />
                    </Floating>

                    <GlowPulse color="rgba(255, 63, 164, 0.55)">
                        <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                            Register
                        </Button>
                    </GlowPulse>

                    <GlowPulse color="rgba(46, 200, 255, 0.55)" duration={2.0} scale>
                        <Button variant="secondary" size="md">Take exam</Button>
                    </GlowPulse>
                </div>
            </section>
        </>
    );
}