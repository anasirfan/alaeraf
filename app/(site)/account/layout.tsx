import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Authoritative server-side gate for every /account route (this layout
 * wraps /account and /account/addresses). proxy.ts already does a fast,
 * optimistic redirect for signed-out visitors before this ever runs; this
 * is the real check — it talks to Supabase Auth directly via the request's
 * cookies, so it can't be bypassed by skipping the proxy.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  return <>{children}</>;
}
