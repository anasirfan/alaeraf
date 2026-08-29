/**
 * Restrained organic ornaments. Decorative only — always aria-hidden.
 */

export function LeafGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} fill="none" aria-hidden="true">
      <path
        d="M24 2C10 16 4 30 6 42c1.6 9.5 9 18 18 20 9-2 16.4-10.5 18-20C44 30 38 16 24 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M24 8v52" stroke="var(--ivory)" strokeWidth="1" opacity="0.5" />
      <path
        d="M24 22 12 30M24 34 12 42M24 22l12 8M24 34l12 8"
        stroke="var(--ivory)"
        strokeWidth="0.9"
        opacity="0.35"
      />
    </svg>
  );
}

export function DropGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 54" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 2C11 15 4 24 4 33a16 16 0 0 0 32 0c0-9-7-18-16-31Z"
        fill="currentColor"
        opacity="0.9"
      />
      <ellipse cx="14" cy="34" rx="4" ry="6" fill="var(--ivory)" opacity="0.32" />
    </svg>
  );
}

/** Soft wave used to hand off between sections. */
export function WaveEdge({
  className = "",
  fill = "var(--ivory)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 64c180-42 360-42 540-8s360 62 540 26 300-54 360-64v102H0Z"
        fill={fill}
      />
    </svg>
  );
}

/** Concentric ripple rings — the water world's quiet signature. */
export function Ripple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
      {[60, 100, 140, 180].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.5 - i * 0.1}
        />
      ))}
    </svg>
  );
}

/** Hairline botanical branch — used at large scale, very low opacity. */
export function Branch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 420" className={className} fill="none" aria-hidden="true">
      <path d="M100 420C100 300 96 180 100 0" stroke="currentColor" strokeWidth="1.2" />
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 60 + i * 48;
        return (
          <g key={i}>
            <path
              d={`M100 ${y}C74 ${y - 12} 52 ${y - 4} 40 ${y + 16}C64 ${y + 26} 88 ${y + 14} 100 ${y}Z`}
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d={`M100 ${y + 24}C126 ${y + 12} 148 ${y + 20} 160 ${y + 40}C136 ${y + 50} 112 ${y + 38} 100 ${y + 24}Z`}
              stroke="currentColor"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
}
