// src/components/ui/GlowPulse.jsx
import { motion, useReducedMotion } from "framer-motion";

/**
 * GlowPulse — a soft, infinite glow pulse.
 * Used for hero CTAs and active indicators.
 * Respects prefers-reduced-motion (renders static).
 */
export default function GlowPulse({
    children,
    color = "rgba(255, 63, 164, 0.45)", // pink default
    maxOpacity = 0.45,
    duration = 2.4,
    scale = false,
    className = "",
    style = {},
    ...rest
}) {
    const prefersReduced = useReducedMotion();

    if (prefersReduced) {
        return (
            <div className={className} style={style} {...rest}>
                {children}
            </div>
        );
    }

    const boxShadow = [
        `0 0 0 ${color.replace("0.45", "0")}`,
        `0 0 24px ${color}`,
        `0 0 0 ${color.replace("0.45", "0")}`,
    ];

    return (
        <motion.div
            className={className}
            style={{ display: "inline-block", ...style }}
            animate={{
                boxShadow,
                ...(scale ? { scale: [1, 1.02, 1] } : {}),
            }}
            transition={{
                duration,
                ease: "easeInOut",
                repeat: Infinity,
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
}