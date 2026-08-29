type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "light" | "water";
};

const toneStyles = {
  default: "text-botanical",
  light: "text-sage",
  water: "text-botanical/80",
};

export function SectionLabel({
  children,
  className = "",
  tone = "default",
}: SectionLabelProps) {
  return (
    <span
      className={[
        "inline-block text-xs font-semibold uppercase tracking-[0.22em]",
        toneStyles[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
