import { createClient } from "@/lib/supabase/server";

/**
 * Explicit server-side authorization check for every admin mutation
 * (categories/products/images CRUD, etc). This is defense-in-depth, not
 * the only thing standing between a non-admin and these tables — every
 * write below is also covered by an "*_admin_write" RLS policy that
 * requires is_admin(), so even a request that reached this code some other
 * way would still be rejected at the database. Throwing a clear error here
 * just means the admin UI shows a sensible message instead of a raw
 * Postgres RLS violation.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please log in again.");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return { supabase, user };
}
