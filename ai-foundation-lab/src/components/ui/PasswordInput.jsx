// src/components/ui/PasswordInput.jsx
import { forwardRef, useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Form.css";

function evaluateStrength(password) {
    if (!password) return { score: 0, label: "", className: "" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", className: "weak" };
    if (score === 2) return { score: 2, label: "Fair", className: "medium" };
    if (score === 3 || score === 4) return { score: 3, label: "Strong", className: "strong" };
    return { score: 4, label: "Very strong", className: "very-strong" };
}

const PasswordInput = forwardRef(function PasswordInput(
    {
        value = "",
        showStrength = false,
        error = false,
        success = false,
        size = "md",
        className = "",
        ...rest
    },
    ref
) {
    const [visible, setVisible] = useState(false);
    const strength = useMemo(() => evaluateStrength(value), [value]);

    const wrapClasses = [
        "input-wrap",
        "input-wrap--right-icon",
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
        <>
            <div className={wrapClasses}>
                <input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    className={inputClasses}
                    value={value}
                    {...rest}
                />

                <button
                    type="button"
                    className="input__button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    tabIndex={0}
                >
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {showStrength && value.length > 0 && (
                <>
                    <div className="strength" aria-hidden="true">
                        {[1, 2, 3, 4].map((n) => (
                            <span
                                key={n}
                                className={[
                                    "strength__bar",
                                    strength.score >= n && `strength__bar--active-${strength.className}`,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                        ))}
                    </div>
                    <span className="strength__label">Password strength: {strength.label}</span>
                </>
            )}
        </>
    );
});

export default PasswordInput;