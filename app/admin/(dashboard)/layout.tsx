import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Authoritative server-side gate for the entire admin dashboard (every
 * route under this (dashboard) group — /admin, /admin/products, etc — but
 * NOT /admin/login, which lives outside this route group specifically so
 * it never gets wrapped by this check).
 *
 * Two distinct outcomes, both required by the phase spec:
 *  - no session at all            -> /admin/login
 *  - a real session, but the profile's role isn't 'admin' -> away from
 *    admin entirely (home), never a peek at admin UI or data
 *
 * proxy.ts already does a fast, optimistic redirect for signed-out
 * visitors hitting /admin*; this is the real check, reading the role from
 * the database via the caller's own RLS-scoped session (never the
 * service-role client) — it can't be bypassed by skipping the proxy.
 */
export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <AdminShell adminName={profile.full_name ?? ""} adminEmail={profile.email ?? user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
