"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ResetPasswordState = { error?: string } | undefined;

export async function updatePasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Couldn't update your password. Please try again." };
  }

  redirect("/account");
}
