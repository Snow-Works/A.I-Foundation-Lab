// src/components/ui/PhoneInput.jsx
import { forwardRef } from "react";
import "./Form.css";

// Minimal country list — extend later if needed
const COUNTRIES = {
    NG: { flag: "🇳🇬", code: "+234", placeholder: "801 234 5678", digits: 10 },
    US: { flag: "🇺🇸", code: "+1", placeholder: "555 234 5678", digits: 10 },
    GB: { flag: "🇬🇧", code: "+44", placeholder: "7700 900123", digits: 10 },
    GH: { flag: "🇬🇭", code: "+233", placeholder: "24 123 4567", digits: 9 },
    KE: { flag: "🇰🇪", code: "+254", placeholder: "712 345678", digits: 9 },
    ZA: { flag: "🇿🇦", code: "+27", placeholder: "82 123 4567", digits: 9 },
};

const PhoneInput = forwardRef(function PhoneInput(
    {
        country = "NG",
        value = "",
        onChange,
        error = false,
        size = "md",
        disabled = false,
        className = "",
        ...rest
    },
    ref
) {
    const c = COUNTRIES[country] || COUNTRIES.NG;

    // Digits only, formatted with spaces every 3-4 digits
    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, c.digits);
        // Group: 3-3-4 for 10-digit, 3-3-3 for 9-digit
        let formatted;
        if (c.digits === 10) {
            formatted = digits.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, a, b, cc) =>
                [a, b, cc].filter(Boolean).join(" ")
            );
        } else {
            formatted = digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, cc) =>
                [a, b, cc].filter(Boolean).join(" ")
            );
        }
        onChange?.({ target: { value: formatted, digits, country } });
    };

    return (
        <div
            className={[
                "phone-group",
                error && "phone-group--error",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className="phone-group__prefix" aria-hidden="true">
                <span className="phone-group__flag">{c.flag}</span>
                <span>{c.code}</span>
            </span>

            <input
                ref={ref}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className="phone-group__input"
                placeholder={c.placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                {...rest}
            />
        </div>
    );
});

export { COUNTRIES };
export default PhoneInput;