"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { updatePasswordAction, type ResetPasswordState } from "./actions";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<ResetPasswordState, FormData>(updatePasswordAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}

      <Input
        label="New Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        minLength={8}
        required
      />

      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your new password"
        minLength={8}
        required
      />

      <SubmitButton pendingLabel="Updating…" className="mt-2 w-full">
        Update Password
      </SubmitButton>
    </form>
  );
}
