// src/lib/motion.js
import { useReducedMotion } from "framer-motion";

/* EASING & TIMING */
/* Mirrors the CSS tokens so JS and CSS motions feel unified. */


export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];
export const EASE_SPRING = [0.34, 1.56, 0.64, 1];

export const DUR = {
    fast: 0.15,
    normal: 0.25,
    slow: 0.45,
    hero: 0.7,
};

/* VARIANTS */
/* Each variant is a plain object { hidden, visible, exit? }
   that can be passed to motion components. */

/* Fade + slight upward motion (the default scroll reveal)  */
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

/* Pure fade  */
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: EASE_OUT },
    },
};

/* Fade + scale (for cards, modals, hero panels)  */
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: EASE_OUT },
    },
};

/*  Slide in from left (for hero composition)  */
export const slideInLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: EASE_OUT },
    },
};

/*  Slide in from right  */
export const slideInRight = {
    hidden: { opacity: 0, x: 32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: EASE_OUT },
    },
};

/*  Stagger container  */
export const staggerContainer = (staggerDelay = 0.08, delayChildren = 0.05) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren,
        },
    },
});

/* Item used inside a stagger container  */
export const staggerItem = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: EASE_OUT },
    },
};

/*  Hero wordmark entrance: slightly larger, slower */
export const heroReveal = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: EASE_OUT },
    },
};

/* Ribbon draw (used when we animate the SVG ribbon on the wordmark) */
export const ribbonDraw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.2, ease: EASE_OUT, delay: 0.3 },
    },
};

/* TRANSITION PRESETS */

export const tapScale = {
    scale: 0.97,
    transition: { duration: DUR.fast, ease: EASE_OUT },
};

export const hoverLift = {
    y: -2,
    transition: { duration: DUR.normal, ease: EASE_OUT },
};

/* HOOK: reduced-motion-aware values */
/* Returns the variants unchanged, or a "instant" version */
/* where everything appears immediately. */
export function useMotionSafe(variants) {
    const prefersReduced = useReducedMotion();

    if (!prefersReduced) return variants;

    // Return a version of the variants where every state has duration 0
    const safe = {};
    for (const key of Object.keys(variants)) {
        const value = variants[key];
        if (value && typeof value === "object") {
            safe[key] = {
                ...value,
                transition: { duration: 0 },
            };
        } else {
            safe[key] = value;
        }
    }
    return safe;
}

/* VIEWPORT DEFAULT, Shared "trigger once" viewport config. */
export const viewportOnce = { once: true, amount: 0.1 };
export const viewportOnceTop = { once: true, amount: 0.08 };