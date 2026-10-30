// src/components/ui/Field.jsx
import { forwardRef, useId, cloneElement, isValidElement } from "react";
import { AlertCircle } from "lucide-react";
import "./Form.css";

const Field = forwardRef(function Field(
    {
        label,
        hint,
        error,
        required = false,
        disabled = false,
        children,
        htmlFor,
        className = "",
        ...rest
    },
    ref
) {
    const generatedId = useId();
    const fieldId = htmlFor || `field-${generatedId.replace(/:/g, "")}`;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    // Pass ids down to the child input so labels/aria work
    const childWithProps = isValidElement(children)
        ? cloneElement(children, {
            id: childIdIfMissing(children, fieldId),
            "aria-describedby": [
                children.props["aria-describedby"],
                hint ? hintId : null,
                error ? errorId : null,
            ]
                .filter(Boolean)
                .join(" ") || undefined,
            "aria-invalid": error ? "true" : undefined,
            "aria-required": required || undefined,
            disabled: disabled || children.props.disabled,
        })
        : children;

    return (
        <div
            ref={ref}
            className={`field ${className}`.trim()}
            {...rest}
        >
            {label && (
                <label className="field__label" htmlFor={fieldId}>
                    {label}
                    {required && (
                        <span className="field__required" aria-hidden="true">*</span>
                    )}
                </label>
            )}

            {childWithProps}

            {hint && !error && (
                <span id={hintId} className="field__hint">
                    {hint}
                </span>
            )}

            {error && (
                <span id={errorId} className="field__error" role="alert">
                    <AlertCircle size={12} aria-hidden="true" />
                    {error}
                </span>
            )}
        </div>
    );
});

// Preserve any id the child already has
function childIdIfMissing(child, fallback) {
    return child.props.id || fallback;
}

export default Field;