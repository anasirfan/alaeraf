import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettingsRow } from "@/lib/settings/queries";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const settings = await getSiteSettingsRow(supabase);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-forest">Settings</h2>
        <p className="mt-1.5 text-sm text-muted">
          Store-wide details shown across the public website. Changes here update the live site —
          allow a few minutes for cached pages to refresh.
        </p>
      </div>

      {settings === null && (
        <div className="mb-6 rounded-sm border border-dashed border-line bg-white/60 p-4 text-sm text-muted">
          The settings table hasn&apos;t been created in the database yet — apply migration{" "}
          <code className="rounded bg-cream px-1.5 py-0.5 text-xs">0009_site_settings.sql</code> first, then
          refresh this page. Until then, the site continues showing its existing contact details.
        </div>
      )}

      <SettingsForm settings={settings} />
    </div>
  );
}
