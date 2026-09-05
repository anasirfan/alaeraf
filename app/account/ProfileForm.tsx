"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { updateProfileAction, type ProfileState } from "./actions";

export function ProfileForm({
  fullName,
  phone,
}: {
  fullName: string;
  phone: string;
}) {
  const [state, formAction] = useActionState<ProfileState, FormData>(updateProfileAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.success && <FormMessage type="success">Your profile has been updated.</FormMessage>}

      <Input
        label="Full Name"
        name="fullName"
        type="text"
        autoComplete="name"
        defaultValue={fullName}
        required
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="03xx-xxxxxxx"
        defaultValue={phone}
      />

      <SubmitButton pendingLabel="Saving…" variant="outline" size="md" className="self-start">
        Save Changes
      </SubmitButton>
    </form>
  );
}
