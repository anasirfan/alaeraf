"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/FormMessage";
import { routes } from "@/lib/site";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <Link
          href={routes.forgotPassword}
          className="self-end text-xs font-medium text-botanical transition-colors hover:text-forest"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton pendingLabel="Signing in…" className="mt-2 w-full">
        Log In
      </SubmitButton>
    </form>
  );
}
