import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormMessage } from "@/components/ui/FormMessage";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Set a new password for your Al Aeraf account.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell eyebrow="Account" title="Set a new password">
      {user ? (
        <ResetPasswordForm />
      ) : (
        <div className="flex flex-col gap-5">
          <FormMessage type="error">
            This link is invalid or has expired. Request a new password reset email and try
            again.
          </FormMessage>
          <Link
            href={routes.forgotPassword}
            className="text-center text-sm font-semibold text-forest hover:text-botanical"
          >
            Request a new link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
