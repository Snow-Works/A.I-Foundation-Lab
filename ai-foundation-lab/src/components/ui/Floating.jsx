// src/components/ui/Floating.jsx
import { motion, useReducedMotion } from "framer-motion";

/**
 * Floating — gentle up/down oscillation.
 * Used for the hero rocket and decorative accents.
 * Respects prefers-reduced-motion (renders static).
 */
export default function Floating({
    children,
    amplitude = 8,
    duration = 4,
    delay = 0,
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

    return (
        <motion.div
            className={className}
            style={style}
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
}