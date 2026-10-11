// src/components/ui/Reveal.jsx
import { motion } from "framer-motion";
import {
    fadeUp,
    fadeIn,
    scaleIn,
    slideInLeft,
    slideInRight,
    heroReveal,
    useMotionSafe,
    viewportOnce,
} from "../../lib/motion.js";

const VARIANTS = {
    fadeUp,
    fadeIn,
    scaleIn,
    slideInLeft,
    slideInRight,
    heroReveal,
};

/**
 * Reveal — animates its children into view when scrolled into the viewport.
 * Renders a motion.div by default. Pass `as="section"` etc. to change tag.
 */
export default function Reveal({
    children,
    variant = "fadeUp",
    delay = 0,
    className = "",
    style = {},
    as = "div",
    once = true,
    amount = 0.2,
    ...rest
}) {
    const base = VARIANTS[variant] || fadeUp;
    const safe = useMotionSafe(base);

    const variants = delay
        ? {
            hidden: safe.hidden,
            visible: {
                ...safe.visible,
                transition: {
                    ...(safe.visible?.transition || {}),
                    delay,
                },
            },
        }
        : safe;

    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            style={style}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={once ? { once: true, amount } : { amount }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}