// src/components/ui/Textarea.jsx
import { forwardRef, useEffect, useRef } from "react";
import "./Form.css";

const Textarea = forwardRef(function Textarea(
    {
        value = "",
        onChange,
        error = false,
        maxLength,
        autoGrow = false,
        showCounter = true,
        minRows = 4,
        className = "",
        ...rest
    },
    ref
) {
    const innerRef = useRef(null);
    const resolvedRef = ref || innerRef;

    // Auto-grow: adjust height to content
    useEffect(() => {
        if (!autoGrow) return;
        const el = typeof resolvedRef === "function" ? null : resolvedRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value, autoGrow, resolvedRef]);

    const length = String(value || "").length;
    const nearLimit = maxLength && length >= maxLength * 0.9 && length < maxLength;
    const atLimit = maxLength && length >= maxLength;

    return (
        <>
            <textarea
                ref={resolvedRef}
                className={[
                    "textarea",
                    error && "textarea--error",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
                rows={minRows}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                {...rest}
            />

            {showCounter && maxLength && (
                <span
                    className={[
                        "textarea-counter",
                        nearLimit && "textarea-counter--warn",
                        atLimit && "textarea-counter--limit",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {length} / {maxLength}
                </span>
            )}
        </>
    );
});

export default Textarea;