"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";

export type SettingsState = { error?: string; success?: boolean } | undefined;

/**
 * Every public page that shows these values is either ISR (revalidate on a
 * timer) or fully static, so a save here also revalidates every route that
 * reads them — otherwise an admin's change wouldn't appear until the next
 * scheduled revalidation or redeploy.
 */
function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/hair-oil");
  revalidatePath("/ro-water");
  revalidatePath("/about");
  revalidatePath("/faqs");
  revalidatePath("/delivery-areas");
  revalidatePath("/subscription");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/subscribe");
}

export async function updateSiteSettingsAction(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  try {
    const { supabase } = await requireAdmin();

    const phoneDisplay = String(formData.get("businessPhoneDisplay") ?? "").trim();
    const phoneDial = String(formData.get("businessPhoneDial") ?? "").trim();
    const email = String(formData.get("businessEmail") ?? "").trim();
    const address = String(formData.get("businessAddress") ?? "").trim();

    if (phoneDial && !/^\+?[0-9]{7,15}$/.test(phoneDial.replace(/[\s-]/g, ""))) {
      return { error: "The call/WhatsApp number should be digits only, optionally starting with + and the country code (e.g. +923001234567)." };
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "That doesn't look like a valid email address." };
    }

    const fields = {
      business_phone_display: phoneDisplay || null,
      business_phone_dial: phoneDial ? phoneDial.replace(/[\s-]/g, "") : null,
      business_email: email || null,
      business_address: address || null,
    };

    const { error } = await supabase.from("site_settings").upsert({ id: true, ...fields }, { onConflict: "id" });
    if (error) {
      return { error: "Couldn't save settings. Please try again." };
    }

    revalidatePublicPages();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
