import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProductType } from "@/types/database.types";

// Accepts either lib/supabase/server.ts's cookie-aware client (admin
// screens) or lib/supabase/public.ts's cookie-free client (static/ISR
// marketing pages) — both resolve to the same SupabaseClient<Database>
// shape, so every function below works from either call site.
type SupabaseServerClient = SupabaseClient<Database>;
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];

export type ProductListItem = ProductRow & {
  categories: { id: string; name: string } | null;
};

export type ProductStatusFilter = "all" | "active" | "inactive";

export type ProductListFilters = {
  search?: string;
  categoryId?: string;
  status?: ProductStatusFilter;
  page?: number;
  pageSize?: number;
};

export type ProductListResult = {
  rows: ProductListItem[];
  count: number;
  page: number;
  pageSize: number;
};

/**
 * Reusable, typed reads for the products/product_images tables. The admin
 * list/edit screens call these today; the storefront can call the same
 * functions once it's wired to Supabase instead of the hardcoded
 * data/content.ts catalog, rather than every page re-deriving its own
 * Supabase query.
 */

export async function listProductsForAdmin(
  supabase: SupabaseServerClient,
  filters: ProductListFilters = {},
): Promise<ProductListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*, categories(id, name)", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.status === "active") {
    query = query.eq("is_active", true);
  } else if (filters.status === "inactive") {
    query = query.eq("is_active", false);
  }

  const { data, error, count } = await query;
  if (error) throw new Error("Couldn't load products.");

  return {
    rows: (data ?? []) as unknown as ProductListItem[],
    count: count ?? 0,
    page,
    pageSize,
  };
}

export async function getProductForAdmin(supabase: SupabaseServerClient, id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}

export async function getProductImages(
  supabase: SupabaseServerClient,
  productId: string,
): Promise<ProductImageRow[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Couldn't load product images.");
  return data ?? [];
}

/**
 * Not called anywhere yet — kept here, ready for a future category-listing
 * page that needs the category name alongside each product.
 */
export async function listActiveProducts(
  supabase: SupabaseServerClient,
  opts?: { categoryId?: string; productType?: ProductType },
): Promise<ProductListItem[]> {
  let query = supabase
    .from("products")
    .select("*, categories(id, name)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts?.productType) query = query.eq("product_type", opts.productType);

  const { data, error } = await query;
  if (error) throw new Error("Couldn't load products.");
  return (data ?? []) as unknown as ProductListItem[];
}

export type ProductWithPrimaryImage = ProductRow & {
  product_images: { storage_path: string; alt_text: string | null }[];
};

/**
 * The query the public /hair-oil and /ro-water pages use: active products
 * of one type, each with its single lowest-sort_order image embedded in
 * the same round trip (PostgREST's per-relation order+limit) — no N+1
 * per-product image lookup, and the "primary image" rule (lowest
 * sort_order wins) lives in one place instead of being re-implemented by
 * every caller.
 */
export async function listActiveProductsForStorefront(
  supabase: SupabaseServerClient,
  opts: { productType?: ProductType; categoryId?: string } = {},
): Promise<ProductWithPrimaryImage[]> {
  let query = supabase
    .from("products")
    .select("*, product_images(storage_path, alt_text, sort_order)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "product_images", ascending: true })
    .limit(1, { referencedTable: "product_images" });

  if (opts.productType) query = query.eq("product_type", opts.productType);
  if (opts.categoryId) query = query.eq("category_id", opts.categoryId);

  const { data, error } = await query;
  if (error) throw new Error("Couldn't load products.");
  return (data ?? []) as unknown as ProductWithPrimaryImage[];
}
