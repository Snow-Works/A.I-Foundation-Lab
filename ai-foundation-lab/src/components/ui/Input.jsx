// src/components/ui/Input.jsx
import { forwardRef } from "react";
import "./Form.css";

const Input = forwardRef(function Input(
    {
        type = "text",
        size = "md",
        leftIcon = null,
        rightIcon = null,
        error = false,
        success = false,
        className = "",
        ...rest
    },
    ref
) {
    const wrapClasses = [
        "input-wrap",
        leftIcon && "input-wrap--left-icon",
        rightIcon && "input-wrap--right-icon",
        error && "input-wrap--error",
        success && "input-wrap--success",
    ]
        .filter(Boolean)
        .join(" ");

    const inputClasses = [
        "input",
        size !== "md" && `input--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={wrapClasses}>
            {leftIcon && (
                <span className="input__icon input__icon--left" aria-hidden="true">
                    {leftIcon}
                </span>
            )}

            <input ref={ref} type={type} className={inputClasses} {...rest} />

            {rightIcon && (
                <span className="input__icon input__icon--right" aria-hidden="true">
                    {rightIcon}
                </span>
            )}
        </div>
    );
});

export default Input;