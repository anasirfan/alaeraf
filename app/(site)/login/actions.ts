"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string } | undefined;

function isSafeNextPath(next: string | null): next is string {
  // Only ever redirect back into our own app — never to an absolute URL a
  // query string could smuggle in.
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = formData.get("next");
  const next = isSafeNextPath(typeof nextRaw === "string" ? nextRaw : null) ? (nextRaw as string) : "/account";

  if (!email || !password) {
    return { error: "Enter your email and password to continue." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Please confirm your email address before logging in — check your inbox for the link." };
    }
    return { error: "That email and password don't match our records." };
  }

  redirect(next);
}
