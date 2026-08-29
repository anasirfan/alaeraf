type BottleProps = {
  className?: string;
};

export function WaterBottle({ className = "" }: BottleProps) {
  return (
    <svg
      viewBox="0 0 200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Al Aeraf RO drinking water bottle"
    >
      <defs>
        <linearGradient id="waterBody" x1="50" y1="70" x2="150" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF4F7" />
          <stop offset="0.35" stopColor="#B8E8F0" />
          <stop offset="0.7" stopColor="#90E0EF" />
          <stop offset="1" stopColor="#52B788" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="waterFill" x1="60" y1="180" x2="140" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#90E0EF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2D6A4F" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="waterShine" x1="70" y1="100" x2="95" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="waterShadow" x="-20%" y="-5%" width="140%" height="115%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#1B4332" floodOpacity="0.18" />
        </filter>
        <clipPath id="bottleClip">
          <path d="M78 70h44c4 0 8 4 8 10v18c22 10 34 32 34 62v198c0 30-24 48-64 48s-64-18-64-48V160c0-30 12-52 34-62V80c0-6 4-10 8-10z" />
        </clipPath>
      </defs>

      {/* Cap */}
      <rect x="80" y="22" width="40" height="32" rx="8" fill="#1B4332" filter="url(#waterShadow)" />
      <rect x="86" y="28" width="28" height="6" rx="2" fill="#52B788" opacity="0.5" />
      <rect x="74" y="50" width="52" height="12" rx="4" fill="#2D6A4F" />

      {/* Neck */}
      <rect x="86" y="62" width="28" height="16" rx="3" fill="#A8D5DE" />

      {/* Bottle body */}
      <path
        d="M78 70h44c4 0 8 4 8 10v18c22 10 34 32 34 62v198c0 30-24 48-64 48s-64-18-64-48V160c0-30 12-52 34-62V80c0-6 4-10 8-10z"
        fill="url(#waterBody)"
        filter="url(#waterShadow)"
        stroke="#ffffff"
        strokeWidth="2"
        strokeOpacity="0.5"
      />

      {/* Animated water level */}
      <g clipPath="url(#bottleClip)">
        <path
          className="animate-wave-fill"
          d="M40 210 Q70 190 100 210 T160 210 V420 H40 Z"
          fill="url(#waterFill)"
        />
        <path
          className="animate-wave-fill-delay"
          d="M40 225 Q75 205 110 225 T180 220 V420 H40 Z"
          fill="#90E0EF"
          opacity="0.35"
        />
      </g>

      {/* Shine */}
      <path
        d="M88 100c2 40 4 100 2 180"
        stroke="url(#waterShine)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Label band */}
      <rect x="52" y="195" width="96" height="88" rx="8" fill="#FAFAF7" fillOpacity="0.92" />
      <rect x="52" y="195" width="96" height="6" rx="2" fill="#90E0EF" />
      <text
        x="100"
        y="230"
        textAnchor="middle"
        fill="#1B4332"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="600"
      >
        Al Aeraf
      </text>
      <text
        x="100"
        y="250"
        textAnchor="middle"
        fill="#2D6A4F"
        fontFamily="system-ui, sans-serif"
        fontSize="8"
        letterSpacing="2.5"
      >
        PURE RO WATER
      </text>
      {/* Droplet icon */}
      <path
        d="M100 268c0 0-12 14-12 22a12 12 0 0024 0c0-8-12-22-12-22z"
        fill="#90E0EF"
        stroke="#2D6A4F"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
    </svg>
  );
}
