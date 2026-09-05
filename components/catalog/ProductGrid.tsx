import { ProductCard } from "./ProductCard";
import { ICONS, type IconName } from "./icons";
import type { ProductWithPrimaryImage } from "@/lib/catalog/products";

/**
 * Shared grid + empty state for /hair-oil and /ro-water. Deliberately dumb:
 * it only renders what it's given — the page decides what to fetch and
 * with which accent, so this file never needs to know about Supabase.
 *
 * `icon` is a name (not a component reference) — see components/catalog/icons.ts
 * for why: ProductCard below is a "use client" component, and React Server
 * Components cannot pass a function/component value as a prop across that
 * boundary.
 */
export function ProductGrid({
  products,
  accent,
  icon,
  emptyMessage,
}: {
  products: ProductWithPrimaryImage[];
  accent: "botanical" | "water";
  icon: IconName;
  emptyMessage: string;
}) {
  if (products.length === 0) {
    const Icon = ICONS[icon];
    return (
      <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-white/50 px-6 py-16 text-center">
        <Icon className="h-8 w-8 text-muted/40" strokeWidth={1.25} />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} accent={accent} placeholderIcon={icon} />
      ))}
    </div>
  );
}
