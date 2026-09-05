import { Leaf, Droplets, type LucideIcon } from "lucide-react";

/**
 * Product-grid placeholder icons, keyed by a plain string name rather than
 * passed around as component references. React Server Components cannot
 * pass a function/component value as a prop into a "use client" component
 * (ProductCard) — only serializable data — so pages (Server Components)
 * hand ProductGrid/ProductCard an IconName, and each resolves the actual
 * Lucide component from this map itself, on whichever side needs to render
 * it.
 */
export type IconName = "leaf" | "droplets";

export const ICONS: Record<IconName, LucideIcon> = {
  leaf: Leaf,
  droplets: Droplets,
};
