"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminLoginState = { error?: string } | undefined;

/**
 * Admin login is deliberately NOT a separate auth system — it's the same
 * Supabase Auth used by customers, gated by an extra check against
 * profiles.role after a normal signInWithPassword(). There is no "admin"
 * option anywhere in signup; the only way a profile ever gets role='admin'
 * is a manual update in the Supabase dashboard (see the phase report).
 */
export async function adminLoginAction(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password to continue." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

  if (profile?.role !== "admin") {
    // A real, valid account — just not an admin one. Sign it back out so a
    // customer never ends up sitting in a session that came from the admin
    // login form; they can log in normally at /login instead.
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }

  redirect("/admin");
}
