import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session cookie on every request so Server
 * Components always see a valid, up-to-date session rather than one that
 * silently expired mid-visit. This is the standard @supabase/ssr
 * "proxy" pattern (Next.js 16 renamed Middleware to Proxy — same
 * functionality, this file is the direct replacement for middleware.ts).
 *
 * Safe to ship before Auth UI exists: with no session cookie present it's
 * a no-op, and if the env vars aren't configured yet it passes requests
 * through unchanged instead of breaking every page load.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the session so a near-expiry token gets refreshed here, before
  // any Server Component tries to read it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic, fast redirect for signed-out visitors hitting /account. This
  // is a UX shortcut, not the security boundary — app/account/layout.tsx
  // does the authoritative getUser() check server-side regardless, so this
  // can't be bypassed by skipping the proxy.
  const { pathname } = request.nextUrl;
  if (!user && pathname.startsWith("/account")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Same optimistic shortcut for /admin, except /admin/login itself — a
  // signed-out visitor there should see the login page, not bounce off it.
  // The authoritative check (session + profiles.role === 'admin') lives in
  // app/admin/(dashboard)/layout.tsx and cannot be bypassed by skipping
  // this proxy; this just avoids a wasted round-trip for the common case.
  if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image optimization requests — no session
    // handling needed there.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
