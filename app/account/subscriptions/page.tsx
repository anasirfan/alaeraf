import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/site";
import { listMySubscriptions } from "@/lib/subscriptions/queries";
import { SubscriptionList } from "./SubscriptionList";

export const metadata: Metadata = {
  title: "My Subscriptions",
  description: "Manage your Al Aeraf monthly water delivery subscriptions.",
};

export const dynamic = "force-dynamic";

export default async function AccountSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // account/layout.tsx already guarantees this

  const subscriptions = await listMySubscriptions(supabase, user.id);

  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <Reveal>
          <Link
            href={routes.account}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.04em] text-muted uppercase transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            My Account
          </Link>
        </Reveal>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal delay={60}>
              <Eyebrow>Subscriptions</Eyebrow>
            </Reveal>
            <Reveal delay={110}>
              <h1 className="display-3 balance mt-4 font-display text-forest">Your Subscriptions</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede pretty mt-3 max-w-xl text-sm text-muted sm:text-base">
                Recurring monthly water delivery, paid cash on each delivery — pause, resume, or
                cancel anytime.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <Button href={routes.subscribe} variant="outline" size="md">
              New Subscription
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Reveal>
        </div>

        {created && (
          <Reveal delay={190} className="mt-8">
            <div className="flex items-center gap-3 rounded-sm border border-sage/30 bg-sage/10 px-5 py-4 text-sm text-botanical">
              <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              Your subscription has been set up. You&apos;ll receive your first delivery on the date
              shown below.
            </div>
          </Reveal>
        )}

        <Reveal delay={220} className="mt-10">
          <SubscriptionList subscriptions={subscriptions} />
        </Reveal>
      </Container>
    </section>
  );
}
