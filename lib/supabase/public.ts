import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * A cookie-free Supabase client for public marketing pages that only ever
 * read public, RLS-readable catalog data (active products/categories).
 *
 * Unlike lib/supabase/server.ts, this never calls cookies() — so using it
 * from a Server Component doesn't force that route into dynamic rendering.
 * A marketing page reading the public catalog doesn't need to know who's
 * visiting, so it can stay static/ISR (export const revalidate = ...)
 * exactly like the rest of the site. Still just the public anon key —
 * RLS applies the same as any other anon request; nothing here bypasses it.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
