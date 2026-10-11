// src/components/landing/HeroBackground.jsx
import "./HeroBackground.css";

export default function HeroBackground() {
    return (
        <div className="hero-bg" aria-hidden="true">
            {/* Base: signature gradient */}
            <div className="hero-bg__gradient" />

            {/* Animated radial glows */}
            <div className="hero-bg__glow hero-bg__glow--pink" />
            <div className="hero-bg__glow hero-bg__glow--cyan" />

            {/* Hexagonal dot-grid pattern */}
            <svg
                className="hero-bg__pattern"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="hero-hex-dots"
                        x="0"
                        y="0"
                        width="40"
                        height="69.28"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Corners — wrap seamlessly */}
                        <circle cx="0" cy="0" r="1.1" fill="currentColor" />
                        <circle cx="40" cy="0" r="1.1" fill="currentColor" />
                        <circle cx="0" cy="69.28" r="1.1" fill="currentColor" />
                        <circle cx="40" cy="69.28" r="1.1" fill="currentColor" />
                        {/* Center — hexagonal offset */}
                        <circle cx="20" cy="34.64" r="1.1" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-hex-dots)" />
            </svg>

            {/* Bottom edge fade into the page below */}
            <div className="hero-bg__fade" />
        </div>
    );
}