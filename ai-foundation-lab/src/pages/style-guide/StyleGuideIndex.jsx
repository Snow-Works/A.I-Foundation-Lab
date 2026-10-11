// src/pages/style-guide/StyleGuideIndex.jsx
import { Link } from "react-router-dom";
import { Palette, Layers, Sparkles, ArrowRight } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import PillTab from "../../components/ui/PillTab.jsx";
import { Stagger, StaggerItem } from "../../components/ui/motion.js";

const sections = [
    {
        to: "/style-guide/foundations",
        title: "Foundations",
        description:
            "Color tokens, typography, wordmark, and the iconography set — every primitive that defines the visual language.",
        Icon: Palette,
        tone: "pink",
    },
    {
        to: "/style-guide/components",
        title: "Components",
        description:
            "Buttons, cards, pill tabs, the form kit, and modals — all the reusable UI building blocks.",
        Icon: Layers,
        tone: "cyan",
    },
    {
        to: "/style-guide/patterns",
        title: "Patterns",
        description:
            "The progress tracker and the motion primitives that compose pages from those components.",
        Icon: Sparkles,
        tone: "orange",
    },
];

export default function StyleGuideIndex() {
    return (
        <div className="sg-section">
            <header className="sg-section__header">
                <h1 className="sg-section__title">Component library</h1>
                <p className="sg-section__desc">
                    The Phase 1 deliverables, kept as a living reference. Every component
                    below is production-ready and used throughout the app.
                </p>
            </header>

            <Stagger staggerDelay={0.1}>
                <div
                    style={{
                        display: "grid",
                        gap: "var(--space-5)",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                    }}
                >
                    {sections.map(({ to, title, description, Icon, tone }) => (
                        <StaggerItem key={to}>
                            <Card variant="glass" size="md" withTab glow={tone} hoverable>
                                <PillTab floating position="left" variant="default">
                                    {title}
                                </PillTab>

                                <div style={{ marginBottom: "var(--space-3)" }}>
                                    <Icon
                                        size={28}
                                        className="icon-gradient"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="type-body-sm" style={{ marginBottom: "var(--space-4)" }}>
                                    {description}
                                </p>
                                <Link
                                    to={to}
                                    className="type-ui-strong"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        color: "var(--cyan-400)",
                                        textDecoration: "none",
                                    }}
                                >
                                    Open
                                    <ArrowRight size={14} />
                                </Link>
                            </Card>
                        </StaggerItem>
                    ))}
                </div>
            </Stagger>
        </div>
    );
}