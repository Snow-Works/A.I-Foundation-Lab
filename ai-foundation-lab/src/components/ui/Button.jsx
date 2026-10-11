// src/components/ui/Button.jsx
import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./Button.css";

const Button = forwardRef(function Button(
    {
        children,
        variant = "primary",
        size = "md",
        loading = false,
        disabled = false,
        fullWidth = false,
        leftIcon = null,
        rightIcon = null,
        pulse = false,
        as,
        href,
        type = "button",
        className = "",
        onClick,
        ...rest
    },
    ref
) {
    const prefersReducedMotion = useReducedMotion();
    const isDisabled = disabled || loading;
    const isIcon = variant === "icon";

    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && "btn--full",
        loading && "btn--loading",
        pulse && "btn--pulse",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const spinnerSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

    const content = isIcon ? (
        loading ? (
            <Loader2 size={spinnerSize} className="btn__spinner" aria-hidden="true" />
        ) : (
            children
        )
    ) : (
        <>
            {loading ? (
                <Loader2 size={spinnerSize} className="btn__spinner" aria-hidden="true" />
            ) : (
                leftIcon && <span className="btn__icon">{leftIcon}</span>
            )}

            <span className="btn__label">{children}</span>

            {!loading && rightIcon && <span className="btn__icon">{rightIcon}</span>}
        </>
    );

    const motionProps = prefersReducedMotion
        ? {}
        : {
            whileTap: isDisabled ? undefined : { scale: 0.97 },
            whileHover: isDisabled ? undefined : { y: -1 },
            transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
        };

    /*  Case 1: `as` is a custom component (e.g., <Link>)  */
    if (as && typeof as !== "string") {
        const Tag = as;
        return (
            <Tag
                ref={ref}
                className={classes}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                onClick={onClick}
                {...rest}
            >
                {content}
            </Tag>
        );
    }

    /*  Case 2: native anchor (as="a" or href)  */
    const isLink = as === "a" || !!href;

    if (isLink) {
        return (
            <motion.a
                ref={ref}
                href={isDisabled ? undefined : href}
                className={classes}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                onClick={isDisabled ? (e) => e.preventDefault() : onClick}
                {...motionProps}
                {...rest}
            >
                {content}
            </motion.a>
        );
    }

    /*  Case 3: default <button>  */
    return (
        <motion.button
            ref={ref}
            type={type}
            className={classes}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            onClick={onClick}
            {...motionProps}
            {...rest}
        >
            {content}
        </motion.button>
    );
});

export default Button;