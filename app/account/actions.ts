"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: boolean } | undefined;

/**
 * Updates the caller's own profile row (full_name/phone only). Role is
 * never accepted from the form and is never part of this update payload —
 * a customer changing their own role is blocked both here (by omission)
 * and, as a backstop, by the prevent_role_self_escalation trigger in the
 * database itself even if this code ever changed.
 */
export async function updateProfileAction(_prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    return { error: "Name can't be empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your session has expired. Please log in again." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) {
    return { error: "Couldn't save your changes. Please try again." };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
