// src/components/ui/Wordmark.jsx
import { useId } from "react";

export default function Wordmark({ width = 400, className = "", style = {} }) {
  const uid = useId().replace(/:/g, "");
  const ribbonId = `wm-ribbon-${uid}`;

  return (
    <svg
      role="img"
      aria-label="AI Foundation Lab"
      className={className}
      style={style}
      width={width}
      viewBox="0 0 700 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={ribbonId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF3FA4" />
          <stop offset="55%" stopColor="#D4249B" />
          <stop offset="100%" stopColor="#F2511F" />
        </linearGradient>
      </defs>

      {/* Ribbon sweep — flows horizontally behind FOUNDATION */}
      <path
        d="M 30 270
           C 180 240, 400 300, 680 258
           L 680 296
           C 400 336, 180 276, 30 306
           Z"
        fill={`url(#${ribbonId})`}
        opacity="0.9"
      />

      {/* Ai */}
      <text
        x="350"
        y="145"
        fill="currentColor"
        fontFamily='"Montserrat", system-ui, sans-serif'
        fontWeight="900"
        fontSize="165"
        letterSpacing="-8"
        textAnchor="middle"
      >
        Ai
      </text>

      {/* FOUNDATION — single line */}
      <text
        x="350"
        y="285"
        fill="currentColor"
        fontFamily='"Montserrat", system-ui, sans-serif'
        fontWeight="900"
        fontSize="84"
        letterSpacing="-3"
        textAnchor="middle"
      >
        FOUNDATION
      </text>

      {/* LAB — L */}
      <text
        x="260"
        y="455"
        fill="currentColor"
        fontFamily='"Montserrat", system-ui, sans-serif'
        fontWeight="900"
        fontSize="130"
        letterSpacing="-8"
        textAnchor="middle"
      >
        L
      </text>

      {/* LAB — custom Λ (brand mark) */}
      <path
        d="M 302 455 L 350 390 L 398 455"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeLinecap="butt"
        fill="none"
      />

      {/* LAB — B */}
      <text
        x="440"
        y="455"
        fill="currentColor"
        fontFamily='"Montserrat", system-ui, sans-serif'
        fontWeight="900"
        fontSize="130"
        letterSpacing="-8"
        textAnchor="middle"
      >
        B
      </text>
    </svg>
  );
}