import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Accepts either lib/supabase/server.ts's cookie-aware client (admin
// screens) or lib/supabase/public.ts's cookie-free client (static/ISR
// marketing pages) — both resolve to the same SupabaseClient<Database>
// shape, so every function below works from either call site.
type SupabaseServerClient = SupabaseClient<Database>;
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type CategoryWithProductCount = CategoryRow & {
  products: { count: number }[];
};

/**
 * Reusable, typed reads for the categories table — used today by the admin
 * screens, and intended to be the same call the storefront reaches for
 * once it's wired to Supabase instead of data/content.ts, so that switch is
 * a matter of calling these instead of duplicating query logic.
 */

export async function listCategoriesForAdmin(supabase: SupabaseServerClient): Promise<CategoryWithProductCount[]> {
  // Embeds a count of related products in the same round trip via
  // PostgREST's foreign-table aggregate syntax — cheaper than N+1 queries
  // and enough to warn an admin before a delete would be blocked by the
  // products_category_id_fkey RESTRICT constraint.
  const { data, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Couldn't load categories.");
  return (data ?? []) as unknown as CategoryWithProductCount[];
}

export async function listActiveCategories(supabase: SupabaseServerClient): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Couldn't load categories.");
  return data ?? [];
}

export async function getCategoryById(supabase: SupabaseServerClient, id: string): Promise<CategoryRow | null> {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}
