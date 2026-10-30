// src/components/ui/Card.jsx
import { forwardRef } from "react";
import "./Card.css";

const Card = forwardRef(function Card(
    {
        children,
        variant = "glass",     // "glass" | "strong" | "outline" | "gradient"
        size = "md",           // "sm" | "md" | "lg"
        hoverable = false,
        clickable = false,
        withTab = false,       // reserve room above for a pill tab
        pattern = false,       // faint hex-grid layer
        glow = false,          // false | "pink" | "cyan" | "magenta" | "orange"
        accent = false,        // false | "cyan" | "pink" | "magenta" | "orange"
        as,
        href,
        onClick,
        className = "",
        contentClassName = "",
        ...rest
    },
    ref
) {
    const Tag = as || (href ? "a" : onClick || clickable ? "button" : "div");
    const isInteractive = Tag === "button" || Tag === "a";

    const classes = [
        "card",
        `card--${variant}`,
        `card--${size}`,
        hoverable && "card--hoverable",
        clickable && "card--clickable",
        withTab && "card--with-tab",
        accent && `card--accent-${accent}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const glowClass =
        glow === true
            ? "card__glow"
            : glow
                ? `card__glow card__glow--${glow}`
                : null;

    const tagProps =
        Tag === "button" ? { type: "button" } : Tag === "a" ? { href } : {};

    return (
        <Tag
            ref={ref}
            className={classes}
            onClick={onClick}
            {...tagProps}
            {...rest}
        >
            <span className="card__surface" aria-hidden="true">
                {pattern && <span className="card__pattern" />}
                {glowClass && <span className={glowClass} />}
            </span>

            <div className={`card__content ${contentClassName}`.trim()}>
                {children}
            </div>
        </Tag>
    );
});

export default Card;