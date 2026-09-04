import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Droplets } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Ripple } from "@/components/visuals/Ornaments";
import { water } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "RO Drinking Water",
  description: water.lede,
};

/**
 * The water product page, given its own cinematic identity rather than the
 * Home teaser's centred layout: a full-bleed ripple banner, a source-to-door
 * timeline, a dark stat band, and a mirrored FAQ split.
 */
export default function RoWaterPage() {
  return (
    <>
      {/* Full-bleed banner */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/water-ripple.jpg"
          alt="Sunlight rippling across clear, shallow water"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/68 to-ink/15" />
        <div className="absolute inset-0 bg-aqua-deep/25 mix-blend-multiply" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        <Container className="relative pt-[7.5rem] pb-16 sm:pb-20 lg:pb-24">
          <Reveal>
            <Eyebrow tone="light">{water.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-1 mt-6 max-w-3xl font-display whitespace-pre-line text-cream">
              {water.headline}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede pretty mt-6 max-w-lg text-cream/70">{water.lede}</p>
          </Reveal>
          <Reveal delay={210} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {water.badges.map((badge) => (
              <span
                key={badge}
                className="eyebrow flex items-center gap-2 text-[0.7rem] text-cream/75"
              >
                <Droplets className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {badge}
              </span>
            ))}
          </Reveal>
          <Reveal delay={270} className="mt-9">
            <Button href="tel:+923472249475" size="lg" variant="light">
              {water.cta}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Process — vertical alternating timeline */}
      <section className="relative overflow-hidden bg-mist py-20 sm:py-28 lg:py-32">
        <Ripple className="pointer-events-none absolute -right-32 top-16 hidden h-[30rem] w-[30rem] text-aqua-deep/[0.07] lg:block" />

        <Container>
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <Eyebrow tone="water" className="justify-center">
                How It&apos;s Made
              </Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-6 font-display text-forest">From source to your door.</h2>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-16 max-w-3xl">
            <span
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-aqua-deep/20 sm:block"
              aria-hidden="true"
            />
            <ol className="space-y-10 sm:space-y-0">
              {water.process.map((step, i) => {
                const fromLeft = i % 2 === 0;
                return (
                  <Reveal
                    as="li"
                    key={step.step}
                    delay={100 + i * 80}
                    className={`relative sm:flex sm:items-center sm:gap-10 sm:py-7 ${
                      fromLeft ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className={`sm:w-1/2 ${fromLeft ? "sm:text-right sm:pr-4" : "sm:pl-4"}`}>
                      <span className="font-display text-sm tabular-nums text-aqua-deep/45">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-display text-xl text-forest">{step.title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-cool sm:ml-auto">
                        {step.body}
                      </p>
                    </div>
                    <span
                      className="absolute left-1/2 top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-aqua-deep bg-mist sm:block"
                      aria-hidden="true"
                    />
                    <div className="hidden sm:block sm:w-1/2" />
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </Container>
      </section>

      {/* Stat band — a dark, large-numeral strip */}
      <section className="bg-forest py-16 text-cream sm:py-20">
        <Container>
          <div className="grid gap-10 divide-y divide-cream/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {water.stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 100}
                className="pt-8 text-center first:pt-0 sm:pt-0"
              >
                <p className="display-2 font-display text-cream">{stat.value}</p>
                <p className="mt-2 text-sm text-cream/60">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ — mirrored split: accordion first, intro on the right */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal delay={100} className="order-2 lg:order-1 lg:col-span-8">
              <Faq items={water.faq} />
            </Reveal>
            <div className="order-1 lg:order-2 lg:col-span-4">
              <Reveal>
                <Eyebrow tone="water">FAQs</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-6 font-display text-forest">
                  Questions about the water.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-cool">
                  Anything else? Reach out and we&apos;ll answer directly.
                </p>
                <Button href={routes.contact} size="md" variant="outline" className="mt-6">
                  Contact Us
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
