import type { LucideIcon } from "lucide-react";

/**
 * Placeholder for every admin section that has a nav entry but no CRUD
 * screen yet (Products, Categories, Orders, Customers, RO Plants,
 * Subscriptions, Settings). Keeps the sidebar fully navigable — no dead
 * links — without building any management UI ahead of its own phase.
 */
export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-line bg-white/60 px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-cream/60 text-forest">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <h2 className="mt-5 font-display text-xl text-forest">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      <span className="mt-5 inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-[0.65rem] font-semibold tracking-[0.1em] text-muted uppercase">
        Coming in a later phase
      </span>
    </div>
  );
}
