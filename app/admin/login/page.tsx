import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "admin") redirect("/admin");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-ink px-5 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-soft/25 text-sage-soft">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 font-display text-2xl text-cream">Al Aeraf Admin</h1>
          <p className="mt-2 text-sm text-sage-soft/70">
            Restricted access — staff sign-in only.
          </p>
        </div>

        <div className="rounded-sm border border-line bg-cream p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] sm:p-8">
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
