import type { CartItem } from "./types";

/**
 * Guest cart persistence — localStorage only, for now. Versioned key so a
 * future shape change can migrate or discard cleanly instead of crashing on
 * old data. Every call is wrapped: a private-browsing tab, disabled storage,
 * or corrupted JSON should degrade to "empty cart", never break the page.
 *
 * Extension point for later: a logged-in customer's cart could instead be
 * read/written through a server action backed by a `cart_items` table (kept
 * in sync with `auth.uid()` via RLS, mirroring how `product_images` is
 * scoped today). CartContext only calls the two functions below, so swapping
 * this module for a server-backed adapter later won't touch the UI layer.
 */
const CART_STORAGE_KEY = "al-aeraf-cart-v1";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItemShape);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full/blocked — the in-memory cart still works for this tab.
  }
}

function isCartItemShape(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.productId === "string" &&
    typeof v.name === "string" &&
    typeof v.slug === "string" &&
    typeof v.price === "number" &&
    typeof v.quantity === "number"
  );
}
