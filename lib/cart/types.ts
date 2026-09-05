import type { ProductType, StockStatus } from "@/types/database.types";

/** Hard ceiling on a single line's quantity — a sane guard, not a stock check. */
export const MAX_CART_QUANTITY = 20;

/**
 * A cart line. This is a *display snapshot* taken from real Supabase catalog
 * data at the moment the item was added (or last refreshed on /cart) — never
 * a hardcoded/duplicated product definition. `productId` is the only value
 * that matters for a future order: everything else here is for rendering the
 * cart itself. When order creation is built, the server must re-fetch each
 * product by id and re-validate price/availability — nothing in this object
 * should ever be trusted as the price actually charged.
 */
export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  sizeLabel: string | null;
  productType: ProductType;
  stockStatus: StockStatus;
  imagePath: string | null;
  imageAlt: string | null;
  quantity: number;
  /** Set by the /cart page after re-checking the product against Supabase. */
  unavailable?: boolean;
};

export type AddableProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  size_label: string | null;
  product_type: ProductType;
  stock_status: StockStatus;
  product_images?: { storage_path: string; alt_text: string | null }[];
};

export function toCartItem(product: AddableProduct, quantity: number): CartItem {
  const image = product.product_images?.[0];
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compare_at_price,
    sizeLabel: product.size_label,
    productType: product.product_type,
    stockStatus: product.stock_status,
    imagePath: image?.storage_path ?? null,
    imageAlt: image?.alt_text ?? null,
    quantity: clampQuantity(quantity),
  };
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  const int = Math.trunc(value);
  return Math.min(Math.max(int, 1), MAX_CART_QUANTITY);
}
