/**
 * Shared slug rules for categories and products. Both admin forms
 * auto-derive a slug from the name on the client (for a live preview) and
 * the corresponding Server Action re-normalizes through this same function
 * before ever touching the database — so a slug is never trusted verbatim
 * from the client, and "My Product!!" and "my-product" always collapse to
 * the same canonical value when checked for uniqueness.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
