type BottleProps = {
  className?: string;
};

export function HairOilBottle({ className = "" }: BottleProps) {
  return (
    <svg
      viewBox="0 0 200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Al Aeraf herbal hair oil bottle"
    >
      <defs>
        <linearGradient id="oilBody" x1="40" y1="80" x2="160" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D7A5A" />
          <stop offset="0.45" stopColor="#2D6A4F" />
          <stop offset="1" stopColor="#1B4332" />
        </linearGradient>
        <linearGradient id="oilShine" x1="55" y1="120" x2="90" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="oilLiquid" x1="50" y1="200" x2="150" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C9A233" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8B6914" stopOpacity="0.55" />
        </linearGradient>
        <filter id="oilShadow" x="-20%" y="-5%" width="140%" height="115%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#1B4332" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Cap */}
      <rect x="78" y="18" width="44" height="28" rx="6" fill="#1B4332" filter="url(#oilShadow)" />
      <rect x="72" y="42" width="56" height="14" rx="4" fill="#2D6A4F" />
      <rect x="84" y="20" width="8" height="22" rx="2" fill="#52B788" opacity="0.35" />

      {/* Neck */}
      <path d="M86 56h28v28c0 6-4 10-14 10s-14-4-14-10V56z" fill="#245C43" />

      {/* Shoulder + body */}
      <path
        d="M70 84c0-8 8-14 30-14s30 6 30 14v12c18 8 28 24 28 48v200c0 28-22 48-58 48s-58-20-58-48V144c0-24 10-40 28-48V84z"
        fill="url(#oilBody)"
        filter="url(#oilShadow)"
      />

      {/* Liquid fill */}
      <path
        className="animate-liquid"
        d="M54 210c20-10 40 6 60-4s36-8 52 4v178c0 22-18 38-50 38s-50-16-50-38V210z"
        fill="url(#oilLiquid)"
        opacity="0.7"
      />

      {/* Glass shine */}
      <path
        d="M72 120c0 0 8 40 8 120s-4 100-4 100"
        stroke="url(#oilShine)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Label */}
      <rect x="58" y="165" width="84" height="110" rx="10" fill="#FAFAF7" fillOpacity="0.94" />
      <rect x="58" y="165" width="84" height="8" rx="2" fill="#52B788" />
      <text
        x="100"
        y="205"
        textAnchor="middle"
        fill="#1B4332"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="600"
      >
        Al Aeraf
      </text>
      <line x1="74" y1="216" x2="126" y2="216" stroke="#52B788" strokeWidth="1" />
      <text
        x="100"
        y="238"
        textAnchor="middle"
        fill="#2D6A4F"
        fontFamily="system-ui, sans-serif"
        fontSize="8"
        letterSpacing="2"
      >
        HERBAL
      </text>
      <text
        x="100"
        y="252"
        textAnchor="middle"
        fill="#2D6A4F"
        fontFamily="system-ui, sans-serif"
        fontSize="8"
        letterSpacing="2"
      >
        HAIR OIL
      </text>

      {/* Leaf accent on label */}
      <path
        d="M100 268c8-10 18-12 18-4s-10 14-18 18c-8-4-18-10-18-18s10-6 18 4z"
        fill="#52B788"
        opacity="0.85"
      />
    </svg>
  );
}
