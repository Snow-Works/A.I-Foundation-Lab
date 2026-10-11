// src/components/ui/icons/GradientDefs.jsx
export default function GradientDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Primary gradient: pink → orange, used for icon strokes */}
        <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3FA4" />
          <stop offset="55%" stopColor="#D4249B" />
          <stop offset="100%" stopColor="#F2511F" />
        </linearGradient>

        {/* Cyan variant, for links and "success/active" states */}
        <linearGradient id="icon-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2EC8FF" />
          <stop offset="100%" stopColor="#5B2BD6" />
        </linearGradient>

        {/* Silver variant, for neutral UI icons */}
        <linearGradient id="icon-grad-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DCE3F5" />
          <stop offset="100%" stopColor="#A8B2D1" />
        </linearGradient>
      </defs>
    </svg>
  );
}