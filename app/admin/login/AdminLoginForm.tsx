"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { adminLoginAction, type AdminLoginState } from "./actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState<AdminLoginState, FormData>(adminLoginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="admin@al-aeraf.com"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />

      <SubmitButton pendingLabel="Signing in…" className="mt-2 w-full">
        Log In
      </SubmitButton>
    </form>
  );
}
