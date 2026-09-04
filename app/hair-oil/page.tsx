import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { LeafGlyph } from "@/components/visuals/Ornaments";
import { hairOil } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Herbal Hair Oil",
  description: hairOil.lede,
};

/**
 * A dedicated product page, built with its own layout rather than reusing
 * the Home teaser section: a full-bleed banner, a zig-zag ritual timeline,
 * a horizontal ingredient strip, and a split FAQ.
 */
export default function HairOilPage() {
  return (
    <>
      {/* Full-bleed banner — the page's own identity, not the Home arch layout */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/oil-banner.jpg"
          alt="Two bottles of Al Aeraf herbal hair oil among green leaves"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        <Container className="relative pt-[7.5rem] pb-16 sm:pb-20 lg:pb-24">
          <Reveal>
            <Eyebrow tone="light">{hairOil.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-1 mt-6 max-w-3xl font-display whitespace-pre-line text-cream">
              {hairOil.headline}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede pretty mt-6 max-w-lg text-cream/70">{hairOil.lede}</p>
          </Reveal>
          <Reveal delay={210} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {hairOil.badges.map((badge) => (
              <span
                key={badge}
                className="eyebrow flex items-center gap-2 text-[0.7rem] text-sage-soft"
              >
                <Leaf className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {badge}
              </span>
            ))}
          </Reveal>
          <Reveal delay={270} className="mt-9">
            <Button href="tel:+923472249475" size="lg" variant="light">
              {hairOil.cta}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Ritual — zig-zag timeline, alternating sides, connected by a spine */}
      <section className="relative overflow-hidden bg-sand py-20 sm:py-28 lg:py-32">
        <LeafGlyph className="pointer-events-none absolute -left-16 bottom-10 hidden h-[24rem] w-auto rotate-[10deg] text-botanical/[0.06] lg:block" />

        <Container>
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <Eyebrow className="justify-center">The Ritual</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-6 font-display text-forest">
                Four small steps, most evenings.
              </h2>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-16 max-w-3xl">
            <span
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-forest/15 sm:block"
              aria-hidden="true"
            />
            <ol className="space-y-10 sm:space-y-0">
              {hairOil.howToUse.map((step, i) => {
                const fromLeft = i % 2 === 0;
                return (
                  <Reveal
                    as="li"
                    key={step.step}
                    delay={100 + i * 90}
                    className={`relative sm:flex sm:items-center sm:gap-10 sm:py-8 ${
                      fromLeft ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className={`sm:w-1/2 ${fromLeft ? "sm:text-right sm:pr-4" : "sm:pl-4"}`}>
                      <span className="font-display text-sm tabular-nums text-botanical/45">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-display text-xl text-forest">{step.title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted sm:ml-auto">
                        {step.body}
                      </p>
                    </div>
                    <span
                      className="absolute left-1/2 top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-forest bg-sand sm:block"
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

      {/* Ingredients — a horizontal strip of pill cards, not a static grid */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal>
                <Eyebrow>What&apos;s Inside</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-6 max-w-md font-display text-forest">
                  A short, deliberate list.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                As printed on the bottle — nothing borrowed from a longer catalogue.
              </p>
            </Reveal>
          </div>

          <Reveal delay={180} className="mt-12 -mx-6 overflow-x-auto px-6 pb-2">
            <div className="flex gap-5">
              {hairOil.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="w-[15.5rem] shrink-0 rounded-sm border border-forest/12 bg-sand/50 p-6"
                >
                  <Leaf className="h-5 w-5 text-botanical" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg text-forest">{ing.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{ing.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ — split layout: sticky intro + accordion, not the centred pattern */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>FAQs</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-6 font-display text-forest">
                  Questions about the oil.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
                  Anything else? Reach out and we&apos;ll answer directly.
                </p>
                <Button href={routes.contact} size="md" variant="outline" className="mt-6">
                  Contact Us
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </Reveal>
            </div>
            <Reveal delay={180} className="lg:col-span-8">
              <Faq items={hairOil.faq} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
