"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ForgotPasswordState, FormData>(forgotPasswordAction, undefined);

  if (state?.success) {
    return (
      <FormMessage type="success">
        If an account exists for that email, a password reset link is on its way. Check your
        inbox (and spam folder) — the link expires after a while, so use it soon.
      </FormMessage>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <SubmitButton pendingLabel="Sending…" className="mt-2 w-full">
        Send Reset Link
      </SubmitButton>
    </form>
  );
}
