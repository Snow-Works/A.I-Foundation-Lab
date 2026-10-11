// src/components/landing/Timeline.jsx
import { motion, useReducedMotion } from "framer-motion";
import { JOURNEY_STEPS } from "./journeySteps.js";
import "./Timeline.css";

const ACCENT_VAR = {
    pink: "var(--pink-400)",
    magenta: "var(--magenta-500)",
    violet: "var(--violet-600)",
    cyan: "var(--cyan-400)",
    orange: "var(--orange-500)",
};

export default function Timeline() {
    const prefersReduced = useReducedMotion();

    const containerVariants = prefersReduced
        ? {}
        : {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.05 },
            },
        };

    const itemVariants = prefersReduced
        ? {}
        : {
            hidden: { opacity: 0, y: 24 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
        };

    return (
        <motion.ol
            className="timeline"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
        >
            {JOURNEY_STEPS.map((step, i) => {
                const side = i % 2 === 0 ? "left" : "right";
                const Icon = step.Icon;
                const accent = ACCENT_VAR[step.accent] || ACCENT_VAR.pink;

                return (
                    <motion.li
                        key={step.key}
                        className="timeline__item"
                        data-side={side}
                        variants={itemVariants}
                        style={{ "--step-accent": accent }}
                    >
                        {/* Node on the spine */}
                        <div className="timeline__node-wrap" aria-hidden="true">
                            <span className="timeline__num">
                                {String(step.index).padStart(2, "0")}
                            </span>
                            <span className="timeline__node">
                                <Icon />
                            </span>
                        </div>

                        {/* Card */}
                        <div className="timeline__card">
                            <span className="timeline__label">{step.label}</span>
                            <h3 className="timeline__title">{step.title}</h3>
                            <p className="timeline__desc">{step.description}</p>
                        </div>
                    </motion.li>
                );
            })}
        </motion.ol>
    );
}