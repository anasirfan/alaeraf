import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Al Aeraf account.",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(routes.account);

  return (
    <AuthShell
      eyebrow="Account"
      title="Create your account"
      lede="Save your delivery details once, and you're ready whenever ordering opens up."
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.login} className="font-semibold text-forest hover:text-botanical">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
