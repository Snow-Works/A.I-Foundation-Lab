// src/components/ui/Stagger.jsx
import { motion } from "framer-motion";
import {
    staggerContainer,
    staggerItem,
    useMotionSafe,
} from "../../lib/motion.js";

/**
 * Stagger — reveals children one after another with a small delay.
 * Use `<Stagger.Item>` for each child.
 */
export default function Stagger({
    children,
    delayChildren = 0.05,
    staggerDelay = 0.08,
    className = "",
    style = {},
    as = "div",
    amount = 0.2,
    ...rest
}) {
    const container = useMotionSafe(
        staggerContainer(staggerDelay, delayChildren)
    );

    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            style={style}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

/*  Item  */
export function StaggerItem({
    children,
    className = "",
    style = {},
    as = "div",
    ...rest
}) {
    const item = useMotionSafe(staggerItem);
    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            style={style}
            variants={item}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

Stagger.Item = StaggerItem;