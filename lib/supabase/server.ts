import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Still uses the public anon key — RLS applies based on the caller's own
 * session (read from cookies), so this is the right client for anything
 * done "as the signed-in user."
 *
 * For privileged operations that must bypass RLS, use
 * lib/supabase/admin.ts instead, and only from a trusted server context.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // set() was called from a Server Component render, which can't
            // write cookies. Safe to ignore — middleware.ts refreshes the
            // session cookie on every request instead.
          }
        },
      },
    },
  );
}
