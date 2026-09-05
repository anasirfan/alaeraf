import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Al Aeraf account.",
};

function isSafeNextPath(next: string | undefined): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextParam } = await searchParams;
  const next = isSafeNextPath(nextParam) ? nextParam : routes.account;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back"
      lede="Log in to manage your profile, saved addresses, and future orders."
      footer={
        <>
          New to Al Aeraf?{" "}
          <Link href={routes.signup} className="font-semibold text-forest hover:text-botanical">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
