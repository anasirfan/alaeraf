"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { signupAction, type SignupState } from "./actions";

export function SignupForm() {
  const [state, formAction] = useActionState<SignupState, FormData>(signupAction, undefined);

  if (state?.success) {
    return (
      <FormMessage type="success">
        Almost there — we&apos;ve sent a confirmation link to your email. Open it to activate your
        account, then log in.
      </FormMessage>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}

      <Input label="Full Name" name="fullName" type="text" autoComplete="name" placeholder="Your name" required />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="03xx-xxxxxxx"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        minLength={8}
        required
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        minLength={8}
        required
      />

      <SubmitButton pendingLabel="Creating your account…" className="mt-2 w-full">
        Create Account
      </SubmitButton>
    </form>
  );
}
