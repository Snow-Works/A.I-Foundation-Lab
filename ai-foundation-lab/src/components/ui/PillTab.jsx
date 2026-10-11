// src/components/ui/PillTab.jsx
import { forwardRef } from "react";
import "./PillTab.css";

const PillTab = forwardRef(function PillTab(
    {
        children,
        variant = "default", // "default" | "primary" | "cyan" | "silver"
        size = "md", // "sm" | "md" | "lg"
        position = "center", // "center" | "left" | "right"
        floating = false, // floats over a card's top edge
        icon = null,
        interactive = false,
        as,
        onClick,
        className = "",
        ...rest
    },
    ref,
) {
    const Tag = as || (onClick || interactive ? "button" : "span");

    const classes = [
        "pill",
        `pill--${variant}`,
        `pill--${size}`,
        floating && "pill--floating",
        floating && `pill--pos-${position}`,
        (onClick || interactive) && "pill--interactive",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Tag
            ref={ref}
            type={Tag === "button" ? "button" : undefined}
            className={classes}
            onClick={onClick}
            {...rest}>
            {icon && <span className="pill__icon">{icon}</span>}
            <span>{children}</span>
        </Tag>
    );
});

export default PillTab;
