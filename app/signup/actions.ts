"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/origin";

export type SignupState = { error?: string; success?: boolean } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signupAction(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone: phone || null },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/account")}`,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
      return { error: "An account with this email already exists — try logging in instead." };
    }
    return { error: "We couldn't create your account. Please try again." };
  }

  // If email confirmation is off, signUp() already returns a live session —
  // the handle_new_user() trigger has already created the profiles row from
  // this same metadata, so there's nothing left to do but send them in.
  if (data.session) {
    redirect("/account");
  }

  // Confirmation email required — the page shows the "check your email" state.
  return { success: true };
}
