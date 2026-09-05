import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Exchanges a Supabase email-link code (signup confirmation or password
 * recovery) for a real session, then redirects on into the app. Every
 * Supabase auth email (confirm signup, reset password) points here via
 * `emailRedirectTo`/`redirectTo` with a `next` param telling us where to
 * land afterwards.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
