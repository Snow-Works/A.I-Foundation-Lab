// src/pages/style-guide/sections/Foundations.jsx
import { Sparkles, UserPlus, ShieldCheck, Camera, Users, Compass } from "lucide-react";
import Wordmark from "../../../components/ui/Wordmark.jsx";
import LogoMark from "../../../components/ui/LogoMark.jsx";
import Card from "../../../components/ui/Card.jsx";
import { GradientDefs, JourneyIcons } from "../../../components/ui/icons";

export default function Foundations() {
    const colorTokens = [
        ["--ink-950", "var(--ink-950)"],
        ["--indigo-900", "var(--indigo-900)"],
        ["--indigo-700", "var(--indigo-700)"],
        ["--violet-600", "var(--violet-600)"],
        ["--purple-500", "var(--purple-500)"],
        ["--magenta-500", "var(--magenta-500)"],
        ["--pink-400", "var(--pink-400)"],
        ["--crimson-600", "var(--crimson-600)"],
        ["--orange-500", "var(--orange-500)"],
        ["--cyan-400", "var(--cyan-400)"],
    ];

    const lucideIcons = [
        { name: "Sparkles", Icon: Sparkles },
        { name: "UserPlus", Icon: UserPlus },
        { name: "ShieldCheck", Icon: ShieldCheck },
        { name: "Camera", Icon: Camera },
        { name: "Users", Icon: Users },
        { name: "Compass", Icon: Compass },
    ];

    return (
        <>
            <GradientDefs />

            {/* --- COLOR TOKENS --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Color tokens</h2>
                    <p className="sg-section__desc">
                        Extracted from the brand poster. Every color in the app comes from
                        these ten tokens.
                    </p>
                </header>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                        gap: "var(--space-4)",
                    }}
                >
                    {colorTokens.map(([name, val]) => (
                        <div key={name}>
                            <div
                                style={{
                                    height: 64,
                                    borderRadius: "var(--radius-md)",
                                    background: val,
                                    border: "var(--border-hairline)",
                                }}
                            />
                            <code
                                className="type-body-sm"
                                style={{ display: "block", marginTop: 6 }}
                            >
                                {name}
                            </code>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: "var(--space-6)",
                        height: 100,
                        borderRadius: "var(--radius-lg)",
                        background: "var(--gradient-signature)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        letterSpacing: "var(--tracking-wide)",
                    }}
                >
                    SIGNATURE GRADIENT
                </div>
            </section>

            {/* --- TYPOGRAPHY --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Typography</h2>
                    <p className="sg-section__desc">
                        Montserrat for display, Inter for body and UI, Mrs Saint Delafield
                        for the founder signature.
                    </p>
                </header>

                <div style={{ display: "grid", gap: "var(--space-6)" }}>
                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-hero
                        </p>
                        <h2 className="type-hero" style={{ color: "var(--white)" }}>
                            Ai Found
                        </h2>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-h2 / type-h3
                        </p>
                        <h3 className="type-h2" style={{ color: "var(--white)" }}>
                            Mission statement
                        </h3>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-body
                        </p>
                        <p className="type-body" style={{ maxWidth: "60ch" }}>
                            To give students who are already proficient in programming a
                            guild through which to build and apply artificial intelligence
                            to their academic fields of study.
                        </p>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-ui / type-ui-strong
                        </p>
                        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                            <span className="type-ui">Inter 500 · button labels</span>
                            <span className="type-ui-strong" style={{ color: "var(--cyan-400)" }}>
                                Inter 600 · active states
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-label
                        </p>
                        <span className="type-label">Mission</span>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-script — founder signature
                        </p>
                        <p className="type-script">Williams Adaji-Agbane</p>
                    </div>

                    <div>
                        <p className="type-caption" style={{ marginBottom: "var(--space-2)" }}>
                            type-gradient
                        </p>
                        <p className="type-h3 type-gradient">Gradient text</p>
                    </div>
                </div>
            </section>

            {/* --- WORDMARK --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Wordmark</h2>
                    <p className="sg-section__desc">
                        The stacked mark with the pink ribbon sweep and the custom Λ in
                        LAB.
                    </p>
                </header>

                <div style={{ display: "grid", gap: "var(--space-5)" }}>
                    <Card variant="gradient" size="lg">
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Wordmark width={300} style={{ maxWidth: "100%", height: "auto" }} />
                        </div>
                    </Card>

                    <Card variant="glass" size="lg">
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Wordmark width={260} style={{ maxWidth: "100%", height: "auto" }} />
                        </div>
                    </Card>
                </div>

                <h3 className="type-h4" style={{ color: "var(--white)", marginTop: "var(--space-6)", marginBottom: "var(--space-3)" }}>
                    Logo mark — compact contexts
                </h3>
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {[64, 48, 32, 24, 16].map((s) => (
                        <LogoMark key={s} size={s} style={{ color: "var(--white)" }} />
                    ))}
                </div>
            </section>

            {/* --- ICONOGRAPHY --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Iconography</h2>
                    <p className="sg-section__desc">
                        Eight custom journey icons plus Lucide as the base set. All use a
                        1.75 stroke and the pink-to-orange gradient stroke.
                    </p>
                </header>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "var(--space-4)",
                    }}
                >
                    {Object.entries(JourneyIcons).map(([name, Icon]) => (
                        <Card key={name} variant="glass" size="sm">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
                                <Icon size={32} className="icon-gradient" aria-hidden="true" />
                                <span className="type-body-sm">{name}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                <h3 className="type-h4" style={{ color: "var(--white)", marginTop: "var(--space-6)", marginBottom: "var(--space-3)" }}>
                    Lucide with gradient stroke
                </h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "var(--space-4)",
                    }}
                >
                    {lucideIcons.map(({ name, Icon }) => (
                        <Card key={name} variant="glass" size="sm">
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
                                <Icon size={32} className="icon-gradient" aria-hidden="true" />
                                <span className="type-body-sm">{name}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
}