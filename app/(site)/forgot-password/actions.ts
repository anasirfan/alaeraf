"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/origin";

export type ForgotPasswordState = { error?: string; success?: boolean } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return { error: "Enter the email address you signed up with." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  // Supabase already avoids confirming/denying whether the address has an
  // account (it returns success either way for a well-formed email), so we
  // always show the same generic message — never reveal account existence.
  if (error && !error.message.toLowerCase().includes("rate limit")) {
    return { error: "Something went wrong sending the reset email. Please try again shortly." };
  }
  if (error) {
    return { error: "Too many attempts — please wait a few minutes before trying again." };
  }

  return { success: true };
}
