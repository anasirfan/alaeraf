import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 *
 * The `server-only` import above makes the build fail if this module is
 * ever pulled into a Client Component or otherwise reaches the browser
 * bundle, so SUPABASE_SERVICE_ROLE_KEY can never leak client-side.
 *
 * Use only from trusted server contexts (Route Handlers, Server Actions,
 * admin-only jobs) for operations that must bypass RLS — e.g. admin
 * writes to ro_plants or products before an admin UI exists. Everything
 * else should go through lib/supabase/server.ts so RLS keeps applying.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "createAdminClient() requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "to be set in the server environment.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
