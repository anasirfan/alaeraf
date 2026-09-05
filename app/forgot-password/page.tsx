import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { routes } from "@/lib/site";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset the password for your Al Aeraf account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Reset your password"
      lede="Tell us the email on your account and we'll send a link to set a new password."
      footer={
        <>
          Remembered it after all?{" "}
          <Link href={routes.login} className="font-semibold text-forest hover:text-botanical">
            Back to log in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
