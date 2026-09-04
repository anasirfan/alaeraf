import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Steps } from "@/components/ui/Steps";
import { SubscriptionSection } from "@/components/subscription/SubscriptionSection";
import { subscription } from "@/data/content";

export const metadata: Metadata = {
  title: "Subscription",
  description: subscription.lede,
};

export default function SubscriptionPage() {
  return (
    <>
      <SubscriptionSection />

      {/* How it works */}
      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <Eyebrow tone="water">How It Works</Eyebrow>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Set it once, forget about it.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Reveal delay={140}>
              <Steps items={subscription.howItWorks} tone="water" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Eyebrow tone="water">FAQs</Eyebrow>
            <Reveal delay={80}>
              <h2 className="display-2 mt-6 font-display text-forest">
                Questions about subscribing.
              </h2>
            </Reveal>
            <Reveal delay={140} className="mt-10">
              <Faq items={subscription.faq} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
