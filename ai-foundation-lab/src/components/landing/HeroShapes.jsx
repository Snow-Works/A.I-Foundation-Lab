// src/components/landing/HeroShapes.jsx

/* ============================================================
   ORGANIC BLOB — matches the poster's soft white-to-pink shape
   ============================================================ */
export function BlobShape({ className = "", style = {}, idSuffix = "" }) {
  const gid = `blob-grad-${idSuffix}`;
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 600 700"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="35%" y1="0%" x2="55%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FBF2F7" />
          <stop offset="100%" stopColor="#FFC8E2" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FF3FA4" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#FF3FA4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft pink glow behind the blob */}
      <ellipse cx="320" cy="400" rx="320" ry="340" fill={`url(#${gid}-glow)`} />

      {/* Organic blob path — asymmetric like the poster */}
      <path
        d="M 300 30
           C 460 20, 570 130, 570 300
           C 575 470, 490 640, 320 680
           C 150 720, 20 600, 15 430
           C 10 260, 60 130, 200 60
           C 235 40, 265 32, 300 30 Z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
}

/* ============================================================
   FOUNDER PORTRAIT PLACEHOLDER — only used if /assets/founder.webp
   is not present.
   ============================================================ */
export function PortraitPlaceholder({ className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 200 260"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: "90%", height: "auto", maxHeight: "100%" }}
      >
        <defs>
          <linearGradient id="portrait-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A1B9B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#140A5C" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="80" r="48" fill="url(#portrait-fill)" />
        <path
          d="M 20 260
             C 20 190, 50 148, 100 148
             C 150 148, 180 190, 180 260 Z"
          fill="url(#portrait-fill)"
        />
        <circle cx="100" cy="80" r="6" fill="#2EC8FF" opacity="0.85" />
      </svg>
    </div>
  );
}

/* ============================================================
   ROCKET — gold-toned, angled up-right (matching the poster)
   ------------------------------------------------------------
   Drawn upright, then rotated 32° clockwise around the center
   so the nose points up-right and the exhaust trails down-left.
   Fits inside viewBox 0 0 200 200, so any square container
   (64×64 in FinalCTA, up to 150×150 in HeroVisual) works.
   ============================================================ */
export function RocketSVG({ className = "", style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rocket-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE9B5" />
          <stop offset="45%" stopColor="#E5B25C" />
          <stop offset="100%" stopColor="#9C6E24" />
        </linearGradient>
        <linearGradient id="rocket-fin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4249B" />
          <stop offset="100%" stopColor="#5B2BD6" />
        </linearGradient>
        <linearGradient id="rocket-window-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9FF0FF" />
          <stop offset="100%" stopColor="#2EC8FF" />
        </linearGradient>
        <linearGradient id="rocket-flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD36E" />
          <stop offset="50%" stopColor="#F2511F" />
          <stop offset="100%" stopColor="#C4162E" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="rotate(32 100 100)">
        {/* Exhaust flame */}
        <path
          d="M 100 152
             C 88 168, 86 182, 100 196
             C 114 182, 112 168, 100 152 Z"
          fill="url(#rocket-flame-grad)"
        />

        {/* Left fin */}
        <path
          d="M 78 130 L 56 158 L 78 158 Z"
          fill="url(#rocket-fin-grad)"
        />

        {/* Right fin */}
        <path
          d="M 122 130 L 144 158 L 122 158 Z"
          fill="url(#rocket-fin-grad)"
        />

        {/* Body */}
        <path
          d="M 100 22
             C 82 40, 78 62, 78 96
             L 78 152
             L 122 152
             L 122 96
             C 122 62, 118 40, 100 22 Z"
          fill="url(#rocket-body-grad)"
          stroke="#8C5A1F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Window ring */}
        <circle cx="100" cy="92" r="15" fill="#0A0630" opacity="0.85" />
        <circle cx="100" cy="92" r="12" fill="url(#rocket-window-grad)" />
        <circle cx="96" cy="88" r="4" fill="#FFFFFF" opacity="0.7" />

        {/* Body highlight */}
        <path
          d="M 86 50 C 84 70, 84 110, 85 145"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.35"
          fill="none"
        />

        {/* Bottom rim */}
        <rect
          x="78"
          y="148"
          width="44"
          height="4"
          rx="1.5"
          fill="#8C5A1F"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

/* ============================================================
   ROBOT HEAD — silver with cyan LEDs, thinking pose
   ============================================================ */
export function RobotSVG({ className = "", style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="robot-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F7FC" />
          <stop offset="55%" stopColor="#C9D1E3" />
          <stop offset="100%" stopColor="#7E8699" />
        </linearGradient>
        <linearGradient id="robot-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B93A7" />
          <stop offset="100%" stopColor="#4E5769" />
        </linearGradient>
      </defs>

      <rect x="80" y="150" width="40" height="70" rx="6" fill="url(#robot-shadow)" />
      <line x1="82" y1="162" x2="118" y2="162" stroke="#2EC8FF" strokeWidth="1.6" opacity="0.75" />
      <line x1="82" y1="174" x2="118" y2="174" stroke="#2EC8FF" strokeWidth="1.6" opacity="0.75" />
      <line x1="82" y1="186" x2="118" y2="186" stroke="#2EC8FF" strokeWidth="1.6" opacity="0.55" />

      <path
        d="M 38 40
           C 38 14, 60 6, 100 6
           C 140 6, 162 14, 162 40
           L 162 130
           C 162 154, 140 162, 100 162
           C 60 162, 38 154, 38 130 Z"
        fill="url(#robot-metal)"
      />

      <rect x="58" y="44" width="84" height="84" rx="16" fill="#0A0630" opacity="0.94" />
      <circle cx="82" cy="80" r="6" fill="#2EC8FF" />
      <circle cx="118" cy="80" r="6" fill="#2EC8FF" />
      <circle cx="82" cy="80" r="2" fill="#FFFFFF" />
      <circle cx="118" cy="80" r="2" fill="#FFFFFF" />
      <rect x="82" y="104" width="36" height="4" rx="2" fill="#2EC8FF" opacity="0.75" />

      <circle cx="34" cy="90" r="5" fill="#2EC8FF" opacity="0.9" />
      <circle cx="166" cy="90" r="5" fill="#2EC8FF" opacity="0.9" />

      <line x1="100" y1="6" x2="100" y2="-2" stroke="#C9D1E3" strokeWidth="2" />
      <circle cx="100" cy="-2" r="3" fill="#FF3FA4" />
    </svg>
  );
}