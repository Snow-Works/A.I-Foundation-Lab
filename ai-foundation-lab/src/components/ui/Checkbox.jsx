// src/components/ui/Checkbox.jsx
import { forwardRef } from "react";
import { Check } from "lucide-react";
import "./Form.css";

const Checkbox = forwardRef(function Checkbox(
    {
        label,
        error = false,
        className = "",
        ...rest
    },
    ref
) {
    return (
        <label
            className={[
                "checkbox",
                error && "checkbox--error",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <input ref={ref} type="checkbox" {...rest} />
            <span className="checkbox__box" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
            </span>
            {label && <span>{label}</span>}
        </label>
    );
});

export default Checkbox;