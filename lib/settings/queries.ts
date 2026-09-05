import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Works from either lib/supabase/server.ts's cookie-aware client (admin
// screen) or lib/supabase/public.ts's cookie-free client (public marketing
// pages) — same pattern as lib/catalog/*.
type SupabaseServerClient = SupabaseClient<Database>;
export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

/**
 * The values every public page falls back to if the site_settings row is
 * ever missing (e.g. migration 0009 hasn't been applied yet) or a field
 * hasn't been filled in — these match exactly what was previously
 * hard-coded in data/content.ts, so a missing/incomplete row never breaks
 * a page, it just shows the same values the site always has.
 */
export const SITE_SETTINGS_DEFAULTS = {
  business_phone_display: "0347 2249475",
  business_phone_dial: "+923472249475",
  business_email: null as string | null,
  business_address: "Karachi — Nazimabad & nearby",
};

export type ResolvedSiteSettings = typeof SITE_SETTINGS_DEFAULTS;

/**
 * Reads the single site_settings row. Never throws — a missing table
 * (migration not yet applied) or missing row both resolve to the same
 * defaults above, so public pages stay up even mid-rollout.
 */
export async function getSiteSettings(supabase: SupabaseServerClient): Promise<ResolvedSiteSettings> {
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();

  if (!data) return { ...SITE_SETTINGS_DEFAULTS };

  return {
    business_phone_display: data.business_phone_display || SITE_SETTINGS_DEFAULTS.business_phone_display,
    business_phone_dial: data.business_phone_dial || SITE_SETTINGS_DEFAULTS.business_phone_dial,
    business_email: data.business_email || SITE_SETTINGS_DEFAULTS.business_email,
    business_address: data.business_address || SITE_SETTINGS_DEFAULTS.business_address,
  };
}

/** Raw row for the admin Settings form (so empty fields show as empty, not defaulted). */
export async function getSiteSettingsRow(supabase: SupabaseServerClient): Promise<SiteSettingsRow | null> {
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  return data ?? null;
}
