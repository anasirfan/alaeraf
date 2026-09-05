"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import type { SiteSettingsRow } from "@/lib/settings/queries";
import { updateSiteSettingsAction, type SettingsState } from "./actions";

export function SettingsForm({ settings }: { settings: SiteSettingsRow | null }) {
  const [state, formAction] = useActionState<SettingsState, FormData>(updateSiteSettingsAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-line bg-white p-6 sm:p-8" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.success && <FormMessage type="success">Settings saved — the live website will reflect this shortly.</FormMessage>}

      <div>
        <h3 className="font-display text-lg text-forest">Contact details</h3>
        <p className="mt-1 text-sm text-muted">
          Shown on the Contact page, in the site footer, and as the &quot;Call to Order&quot; button on the Hair
          Oil and RO Water pages.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Phone / WhatsApp (as shown to customers)"
          name="businessPhoneDisplay"
          type="text"
          defaultValue={settings?.business_phone_display ?? ""}
          placeholder="0347 2249475"
          hint="The formatted number customers see."
        />
        <Input
          label="Phone / WhatsApp (dialable number)"
          name="businessPhoneDial"
          type="text"
          defaultValue={settings?.business_phone_dial ?? ""}
          placeholder="+923472249475"
          hint="Used for the actual tel: / WhatsApp link — include the country code."
        />
      </div>

      <Input
        label="Email (optional)"
        name="businessEmail"
        type="email"
        defaultValue={settings?.business_email ?? ""}
        placeholder="orders@al-aeraf.com"
        hint="Shown in the footer and on the Contact page once set."
      />

      <Input
        label="Address / service area"
        name="businessAddress"
        type="text"
        defaultValue={settings?.business_address ?? ""}
        placeholder="Karachi — Nazimabad & nearby"
        hint="A short line describing where you're based / deliver — not the precise street address of an RO plant (manage those under RO Plants)."
      />

      <div>
        <SubmitButton pendingLabel="Saving…" variant="solid" size="md">
          Save Settings
        </SubmitButton>
      </div>
    </form>
  );
}
