import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { subscription } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscription",
  description: subscription.lede,
};

/**
 * Distinct from the Home teaser's three-card grid: a dark split header,
 * plans laid out as a feature-comparison table, a numbered how-it-works
 * strip, and a centred FAQ.
 */

// Every feature that appears on any plan, in a stable order, so the table
// has one row per feature rather than one column of loose bullet points.
const ALL_FEATURES = Array.from(
  new Set(subscription.plans.flatMap((p) => p.features)),
);

export default function SubscriptionPage() {
  return (
    <>
      {/* Split header */}
      <section className="relative isolate overflow-hidden bg-forest text-cream">
        <Image
          src="/images/water-glass.jpg"
          alt="Al Aeraf RO water bottles against a mountain lake backdrop"
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/95 to-forest/70" />

        <Container className="relative pt-[7.5rem] pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow tone="light">{subscription.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display-1 mt-6 font-display whitespace-pre-line text-cream">
                {subscription.headline}
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede pretty mt-6 max-w-lg text-cream/70">{subscription.lede}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-1/3 border-b border-line pb-6 pr-4 align-bottom text-[0.75rem] tracking-[0.06em] text-muted uppercase">
                    Included
                  </th>
                  {subscription.plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={`border-b pb-6 pr-4 align-bottom ${
                        plan.featured ? "border-forest" : "border-line"
                      }`}
                    >
                      <span className="font-display text-xl text-forest">{plan.name}</span>
                      <span className="mt-1 block text-[0.75rem] font-normal tracking-normal text-muted normal-case">
                        {plan.for}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feature, i) => (
                  <Reveal as="tr" key={feature} delay={i * 40} className="align-middle">
                    <td className="border-b border-line py-4 pr-4 text-sm text-muted">
                      {feature}
                    </td>
                    {subscription.plans.map((plan) => (
                      <td
                        key={plan.name}
                        className={`border-b py-4 pr-4 ${
                          plan.featured ? "border-forest/30 bg-forest/[0.03]" : "border-line"
                        }`}
                      >
                        {(plan.features as readonly string[]).includes(feature) ? (
                          <Check className="h-4 w-4 text-sage" strokeWidth={2} />
                        ) : (
                          <Minus className="h-4 w-4 text-muted/35" strokeWidth={2} />
                        )}
                      </td>
                    ))}
                  </Reveal>
                ))}
                <tr>
                  <td className="pt-8" />
                  {subscription.plans.map((plan) => (
                    <td key={plan.name} className="pt-8 pr-4">
                      <Button
                        href={routes.subscribe}
                        variant={plan.featured ? "solid" : "outline"}
                        className="w-full"
                      >
                        {subscription.cta}
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <Reveal delay={120}>
            <p className="mt-8 text-[0.75rem] tracking-[0.04em] text-muted">
              {subscription.disclaimer}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* How it works — numbered horizontal strip */}
      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <Eyebrow tone="water">How It Works</Eyebrow>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Set it once, forget about it.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 border-t border-line-cool pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {subscription.howItWorks.map((step, i) => (
              <Reveal key={step.step} delay={100 + i * 90}>
                <span className="font-display text-3xl tabular-nums text-aqua-deep/35">
                  {step.step}
                </span>
                <h3 className="mt-3 font-display text-lg text-forest">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-cool">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Eyebrow tone="water" className="justify-center">
              FAQs
            </Eyebrow>
            <Reveal delay={80}>
              <h2 className="display-2 balance mt-6 text-center font-display text-forest">
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
