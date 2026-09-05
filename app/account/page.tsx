import type { Metadata } from "next";
import { Mail, MapPin, ArrowRight, LogOut } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { ProfileForm } from "./ProfileForm";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Al Aeraf profile and saved addresses.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The layout above already redirects signed-out visitors — user is
  // guaranteed here, this satisfies TypeScript's narrowing.
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email, created_at")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? "";
  const phone = profile?.phone ?? "";
  const email = profile?.email ?? user.email ?? "";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="flex flex-col gap-4 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <Eyebrow>My Account</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display-3 balance mt-4 font-display text-forest">
                {fullName ? `Hello, ${fullName.split(" ")[0]}` : "Hello there"}
              </h1>
            </Reveal>
            {memberSince && (
              <Reveal delay={140}>
                <p className="mt-2 text-sm text-muted">Member since {memberSince}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={150}>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="md">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Log Out
              </Button>
            </form>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={180} className="rounded-sm border border-line bg-cream/40 p-6 sm:p-8">
            <h2 className="font-display text-xl text-forest">Profile details</h2>
            <p className="mt-1.5 text-sm text-muted">
              Your name and phone are used for delivery — keep them current.
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-sm border border-line/70 bg-ivory px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.6} />
              <div>
                <p className="text-[0.7rem] tracking-[0.08em] text-muted uppercase">Email</p>
                <p className="text-sm text-ink-text">{email}</p>
              </div>
            </div>

            <div className="mt-6">
              <ProfileForm fullName={fullName} phone={phone} />
            </div>
          </Reveal>

          <Reveal
            delay={230}
            className="flex flex-col justify-between gap-6 rounded-sm border border-line bg-sand/50 p-6 sm:p-8"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ivory text-forest">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <h2 className="mt-4 font-display text-xl text-forest">Delivery addresses</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Save the addresses you deliver to most, and mark one as your default for whenever
                ordering opens up.
              </p>
            </div>
            <Button href={routes.addresses} variant="outline" size="md" className="self-start">
              Manage Addresses
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export const dynamic = "force-dynamic";
