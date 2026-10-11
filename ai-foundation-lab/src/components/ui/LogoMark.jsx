// src/components/ui/LogoMark.jsx
import { useId } from "react";

export default function LogoMark({ size = 48, className = "", style = {} }) {
    const uid = useId().replace(/:/g, "");
    const ribbonId = `lm-ribbon-${uid}`;

    return (
        <svg
            role="img"
            aria-label="AI Foundation Lab"
            className={className}
            style={style}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={ribbonId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3FA4" />
                    <stop offset="100%" stopColor="#F2511F" />
                </linearGradient>
            </defs>

            {/* Ribbon arc — flows under the Ai mark */}
            <path
                d="M 8 66
           C 28 42, 72 42, 92 66
           L 92 80
           C 72 56, 28 56, 8 80
           Z"
                fill={`url(#${ribbonId})`}
                opacity="0.95"
            />

            {/* Ai text — small, tight, centered */}
            <text
                x="50"
                y="54"
                fontSize="52"
                fill="currentColor"
                fontFamily='"Montserrat", system-ui, sans-serif'
                fontWeight="900"
                textAnchor="middle"
                letterSpacing="-2"
            >
                Ai
            </text>
        </svg>
    );
}