type Tone = "dark" | "light" | "water";

const tones: Record<Tone, { text: string; rule: string }> = {
  dark: { text: "text-botanical", rule: "bg-botanical/35" },
  light: { text: "text-sage-soft", rule: "bg-sage-soft/45" },
  water: { text: "text-aqua-deep", rule: "bg-aqua-deep/40" },
};

export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <p className={`eyebrow flex items-center gap-3 ${t.text} ${className}`}>
      <span className={`h-px w-7 shrink-0 ${t.rule}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionNumber({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const color = tone === "light" ? "text-cream/35" : tone === "water" ? "text-aqua-deep/30" : "text-botanical/25";
  return (
    <span className={`font-display text-[0.9rem] tabular-nums ${color}`}>{children}</span>
  );
}
