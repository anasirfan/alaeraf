import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "solid" | "outline" | "light" | "lightOutline" | "water";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 font-sans font-semibold " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-out " +
  "active:translate-y-px rounded-full whitespace-nowrap";

const variants: Record<Variant, string> = {
  solid:
    "bg-forest text-cream hover:bg-ink border border-forest hover:border-ink",
  outline:
    "border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-cream",
  light:
    "bg-cream text-forest hover:bg-white border border-cream",
  lightOutline:
    "border border-cream/35 text-cream hover:bg-cream hover:text-forest",
  water:
    "border border-aqua-deep/30 text-aqua-deep hover:bg-aqua-deep hover:text-mist",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.8125rem] tracking-[0.02em]",
  lg: "px-7 py-3.5 text-sm tracking-[0.02em]",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  children,
  href,
  variant = "solid",
  size = "md",
  className = "",
  ariaLabel,
  type = "button",
  onClick,
  disabled = false,
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${
    disabled ? "pointer-events-none opacity-60" : ""
  } ${className}`;

  if (href) {
    // External / non-navigational links (tel:, mailto:, http(s), plain hash)
    // stay as a real anchor; internal routes go through next/link.
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={cls} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  // No href: a real interactive button — used for form submits and actions.
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
