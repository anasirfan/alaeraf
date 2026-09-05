/**
 * Constants + a pure URL builder for the `product-images` Storage bucket.
 * No Supabase client needed here — the bucket is public-read (0005_storage.sql),
 * so the public object URL is fully deterministic from the project URL and
 * the stored path. Safe to import from both server and client code.
 */
export const PRODUCT_IMAGES_BUCKET = "product-images";

// Generous enough for real product photography, small enough to keep the
// admin upload snappy and guard against accidental huge files.
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export const ALLOWED_PRODUCT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export function isAllowedProductImageType(type: string): boolean {
  return (ALLOWED_PRODUCT_IMAGE_TYPES as readonly string[]).includes(type);
}

export function productImageUrl(storagePath: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${storagePath}`;
}
