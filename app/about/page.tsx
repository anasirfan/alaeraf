import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/visuals/Media";
import { Branch } from "@/components/visuals/Ornaments";
import { brandStory } from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description: brandStory.body[0],
};

export default function AboutPage() {
  return (
    <>
      {/* Intro — the same story told with more room */}
      <section className="relative overflow-hidden bg-ivory pt-[7.5rem] pb-20 sm:pt-40 sm:pb-28 lg:pb-36">
        <Branch className="pointer-events-none absolute -right-16 top-8 hidden h-[36rem] w-auto text-botanical/[0.07] lg:block" />

        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative">
                <Media
                  src="/images/brand-duo.jpg"
                  alt="Al Aeraf herbal hair oil and Al Aeraf RO water bottles, the two product lines shown together"
                  className="arch-soft aspect-[4/5] w-full shadow-[0_50px_90px_-50px_rgba(20,54,31,0.5)]"
                  sizes="(max-width: 1024px) 92vw, 40vw"
                />
                <span
                  className="absolute -bottom-10 -right-10 hidden h-28 w-28 rounded-full border border-line lg:block"
                  aria-hidden="true"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-7 lg:pl-4">
              <Reveal>
                <Eyebrow>{brandStory.eyebrow}</Eyebrow>
              </Reveal>

              <Reveal delay={90}>
                <h1 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
                  {brandStory.headline}
                </h1>
              </Reveal>

              <div className="mt-7 max-w-xl space-y-5">
                {brandStory.body.map((p, i) => (
                  <Reveal key={i} delay={140 + i * 80}>
                    <p className="lede pretty text-muted">{p}</p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={320}>
                <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-4 lg:gap-x-6">
                  {brandStory.pillars.map((pillar) => (
                    <div key={pillar.label}>
                      <dt className="font-display text-base text-forest sm:text-lg">
                        {pillar.label}
                      </dt>
                      <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                        {pillar.note}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Approach — three longer-form points */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow>Our Approach</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Small brand, deliberate choices.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 border-t border-forest/12 pt-10 sm:grid-cols-3">
            {brandStory.approach.map((item, i) => (
              <Reveal key={item.title} delay={120 + i * 90}>
                <span className="font-display text-sm tabular-nums text-botanical/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg text-forest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Promise — a plain, honest note rather than a mission-statement quote */}
      <section className="bg-forest py-20 text-cream sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="light" className="justify-center">
              A Note From Al Aeraf
            </Eyebrow>
            <p className="display-3 balance mt-6 font-display text-cream">{brandStory.promise}</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
