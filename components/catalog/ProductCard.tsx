"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import { productImageUrl } from "@/lib/catalog/images";
import { useCart } from "@/lib/cart/CartContext";
import { ICONS, type IconName } from "./icons";
import type { ProductWithPrimaryImage } from "@/lib/catalog/products";

type Accent = "botanical" | "water";

const ACCENTS: Record<
  Accent,
  { placeholderBg: string; placeholderIcon: string; price: string; compareAt: string; button: string }
> = {
  botanical: {
    placeholderBg: "bg-sand",
    placeholderIcon: "text-botanical/30",
    price: "text-forest",
    compareAt: "text-muted/60",
    button: "bg-forest text-cream hover:bg-ink",
  },
  water: {
    placeholderBg: "bg-mist",
    placeholderIcon: "text-aqua-deep/30",
    price: "text-forest",
    compareAt: "text-muted-cool/60",
    button: "bg-aqua-deep text-mist hover:bg-forest",
  },
};

function formatPrice(value: number) {
  return `Rs ${Math.round(value).toLocaleString()}`;
}

/**
 * One catalog card — real Supabase product data only. A product with no
 * uploaded image gets a plain branded placeholder (the page's own accent
 * icon), never an invented photo. Only ever rendered with active products
 * (the storefront query filters `is_active`), so "Add to Cart" only needs
 * to guard against out-of-stock, not inactive.
 */
export function ProductCard({
  product,
  accent,
  placeholderIcon,
}: {
  product: ProductWithPrimaryImage;
  accent: Accent;
  placeholderIcon: IconName;
}) {
  const PlaceholderIcon = ICONS[placeholderIcon];
  const tone = ACCENTS[accent];
  const image = product.product_images?.[0];
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock_status === "out_of_stock";

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-line bg-ivory">
      <div className={`relative aspect-[4/5] w-full overflow-hidden ${tone.placeholderBg}`}>
        {image ? (
          <Image
            src={productImageUrl(image.storage_path)}
            alt={image.alt_text ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            quality={78}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PlaceholderIcon className={`h-10 w-10 ${tone.placeholderIcon}`} strokeWidth={1.25} />
          </div>
        )}
        {product.compare_at_price != null && product.compare_at_price > product.price && (
          <span className="absolute top-3 left-3 rounded-full bg-forest px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] text-cream uppercase">
            On Sale
          </span>
        )}
        {product.stock_status !== "in_stock" && (
          <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.04em] text-cream uppercase">
            {product.stock_status === "preorder" ? "Pre-order" : "Out of Stock"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.size_label && (
          <p className="text-[0.65rem] font-semibold tracking-[0.08em] text-muted uppercase">{product.size_label}</p>
        )}
        <h3 className="mt-1.5 font-display text-lg text-forest">{product.name}</h3>
        {product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.short_description}</p>
        )}
        <div className="mt-4 flex items-baseline gap-2">
          <span className={`font-display text-lg ${tone.price}`}>{formatPrice(product.price)}</span>
          {product.compare_at_price != null && product.compare_at_price > product.price && (
            <span className={`text-sm line-through ${tone.compareAt}`}>{formatPrice(product.compare_at_price)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[0.8rem] font-semibold tracking-[0.02em] transition-colors duration-300 ${
            outOfStock ? "cursor-not-allowed bg-line text-muted" : tone.button
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2} />
              Added
            </>
          ) : outOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
