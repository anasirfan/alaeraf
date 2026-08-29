type OrganicBackgroundProps = {
  variant?: "hero" | "botanical" | "water" | "cream";
  className?: string;
};

export function OrganicBackground({
  variant = "hero",
  className = "",
}: OrganicBackgroundProps) {
  if (variant === "botanical") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-mint/30 to-cream" />
        <svg className="absolute -left-10 top-0 h-full w-[55%] opacity-[0.12]" viewBox="0 0 400 800" fill="none">
          <path
            className="animate-leaf-sway origin-bottom"
            d="M80 700 C40 520 120 380 60 220 C140 280 180 420 160 700"
            stroke="#1B4332"
            strokeWidth="2"
          />
          <ellipse className="animate-leaf-sway" cx="95" cy="340" rx="48" ry="22" transform="rotate(-35 95 340)" fill="#2D6A4F" />
          <ellipse className="animate-leaf-sway [animation-delay:0.4s]" cx="70" cy="420" rx="40" ry="18" transform="rotate(-50 70 420)" fill="#52B788" />
          <ellipse className="animate-leaf-sway [animation-delay:0.8s]" cx="110" cy="500" rx="44" ry="20" transform="rotate(-28 110 500)" fill="#2D6A4F" />
        </svg>
        <div className="animate-blob absolute right-0 top-1/4 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
        <div className="bg-leaf-pattern absolute inset-0 opacity-[0.04]" />
      </div>
    );
  }

  if (variant === "water") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-mist via-[#d9f0f5] to-mist" />
        <svg className="absolute inset-x-0 bottom-0 w-full opacity-40" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path className="animate-wave-path" fill="#90E0EF" fillOpacity="0.35" d="M0,100 C240,160 480,40 720,100 C960,160 1200,60 1440,110 L1440,200 L0,200 Z" />
          <path className="animate-wave-path-slow" fill="#52B788" fillOpacity="0.12" d="M0,130 C300,80 600,180 900,120 C1100,80 1300,140 1440,120 L1440,200 L0,200 Z" />
        </svg>
        <div className="animate-droplet absolute left-[12%] top-[18%] h-3 w-2.5 rounded-full bg-water/80" />
        <div className="animate-droplet absolute left-[28%] top-[35%] h-2 w-1.5 rounded-full bg-sage/50 [animation-delay:1.2s]" />
        <div className="animate-droplet absolute right-[18%] top-[22%] h-4 w-3 rounded-full bg-water/70 [animation-delay:0.6s]" />
        <div className="animate-droplet absolute right-[30%] top-[48%] h-2.5 w-2 rounded-full bg-water/60 [animation-delay:1.8s]" />
        <div className="bg-ripple-pattern absolute inset-0 opacity-[0.06]" />
      </div>
    );
  }

  if (variant === "cream") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-cream" />
        <div className="bg-leaf-pattern absolute inset-0 opacity-[0.05]" />
        <div className="animate-blob absolute -left-20 top-10 h-64 w-64 rounded-full bg-mint/50 blur-3xl" />
        <div className="animate-blob absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sage/15 blur-3xl [animation-delay:3s]" />
      </div>
    );
  }

  /* hero default */
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-ivory via-mint/25 to-mist/80" />
      <div className="bg-leaf-pattern absolute inset-0 opacity-[0.045]" />
      <div className="animate-blob absolute -left-28 top-10 h-80 w-80 rounded-full bg-mint/60 blur-3xl" />
      <div className="animate-blob absolute -right-24 top-32 h-96 w-96 rounded-full bg-water/35 blur-3xl [animation-delay:2s]" />
      <div className="animate-blob absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sage/20 blur-3xl [animation-delay:4s]" />
      <svg className="absolute right-0 top-20 hidden h-[70%] w-[40%] opacity-[0.08] lg:block" viewBox="0 0 400 600" fill="none">
        <ellipse className="animate-leaf-sway" cx="260" cy="180" rx="70" ry="28" transform="rotate(25 260 180)" fill="#1B4332" />
        <ellipse className="animate-leaf-sway [animation-delay:0.5s]" cx="300" cy="240" rx="55" ry="22" transform="rotate(40 300 240)" fill="#2D6A4F" />
        <ellipse className="animate-leaf-sway [animation-delay:1s]" cx="220" cy="260" rx="48" ry="20" transform="rotate(10 220 260)" fill="#52B788" />
      </svg>
    </div>
  );
}
