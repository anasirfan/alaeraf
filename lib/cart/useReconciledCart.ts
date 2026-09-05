"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import type { CartItem } from "./types";
import type { StockStatus, ProductType } from "@/types/database.types";

type RefreshedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  size_label: string | null;
  product_type: ProductType;
  stock_status: StockStatus;
  is_active?: boolean;
  product_images?: { storage_path: string; alt_text: string | null }[];
};

/**
 * Re-checks the guest cart against the live Supabase catalog exactly once
 * per mount, via the same /api/cart/refresh route — shared by /cart and
 * /checkout so both pages agree on what's actually available and what it
 * actually costs right now. Never trusts the localStorage snapshot for
 * anything a customer could be charged: `subtotal` here is computed from
 * the *reconciled* prices, not whatever the cart happened to remember.
 *
 * This is still only a display/UX layer. Order creation goes through the
 * create_order() RPC, which independently re-validates and re-prices every
 * item server-side — this hook exists so the customer sees accurate
 * numbers *before* placing the order, not as the source of truth for it.
 */
export function useReconciledCart() {
  const { items, isReady, replaceItems } = useCart();
  const [checking, setChecking] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isReady || hasChecked.current || items.length === 0) return;
    hasChecked.current = true;
    setChecking(true);

    const ids = items.map((item) => item.productId);

    fetch("/api/cart/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: RefreshedProduct[] } | null) => {
        if (!data?.products) return; // Fail soft — keep the last-known snapshot.

        const byId = new Map(data.products.map((p) => [p.id, p]));
        const reconciled: CartItem[] = items.map((item) => {
          const fresh = byId.get(item.productId);
          if (!fresh) return { ...item, unavailable: true };
          const image = fresh.product_images?.[0];
          return {
            ...item,
            name: fresh.name,
            slug: fresh.slug,
            price: fresh.price,
            compareAtPrice: fresh.compare_at_price,
            sizeLabel: fresh.size_label,
            productType: fresh.product_type,
            stockStatus: fresh.stock_status,
            imagePath: image?.storage_path ?? item.imagePath,
            imageAlt: image?.alt_text ?? item.imageAlt,
            unavailable: false,
          };
        });
        replaceItems(reconciled);
      })
      .catch(() => {
        // Network hiccup — keep working from the saved snapshot.
      })
      .finally(() => setChecking(false));
    // Deliberately only depends on `isReady` — reconciliation runs once per
    // page load, not every time a quantity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // "unavailable" = gone entirely (deleted/deactivated) — matches /cart's
  // existing semantics. Checkout additionally can't order an out-of-stock
  // item, so it uses `orderableItems` rather than excluding stock status
  // from `unavailable` (which would blur /cart's separate "out of stock"
  // vs "no longer available" messaging).
  const availableItems = items.filter((item) => !item.unavailable);
  const orderableItems = items.filter((item) => !item.unavailable && item.stockStatus !== "out_of_stock");
  const hasUnavailable = items.some((item) => item.unavailable);
  const hasOutOfStock = items.some((item) => !item.unavailable && item.stockStatus === "out_of_stock");
  const subtotal = availableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderableSubtotal = orderableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    availableItems,
    orderableItems,
    hasUnavailable,
    hasOutOfStock,
    subtotal,
    orderableSubtotal,
    checking,
    isReady,
  };
}
