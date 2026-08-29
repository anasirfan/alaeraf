import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/visuals/Media";
import { LeafGlyph } from "@/components/visuals/Ornaments";
import { hairOil } from "@/data/content";
import { routes } from "@/lib/site";

/**
 * THE BOTANICAL WORLD — warm sand ground, amber glass, arch frames, leaf glyphs.
 * Intentionally shares nothing but typography and green with the water section.
 */
export function HairOilSection() {
  return (
    <section id="hair-oil" className="relative scroll-mt-20 overflow-hidden bg-sand">
      <LeafGlyph className="pointer-events-none absolute -left-14 top-24 hidden h-[26rem] w-auto rotate-[-14deg] text-botanical/[0.06] lg:block" />
      <LeafGlyph className="anim-sway pointer-events-none absolute right-[6%] top-12 hidden h-24 w-auto rotate-[18deg] text-botanical/15 xl:block" />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        {/* Section marker */}
        <Reveal className="mb-12 flex items-baseline gap-5 border-b border-forest/12 pb-6 sm:mb-16">
          <span className="font-display text-2xl text-botanical/40 tabular-nums">
            {hairOil.no}
          </span>
          <Eyebrow>{hairOil.eyebrow}</Eyebrow>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Copy */}
          <div className="lg:col-span-5 lg:pt-6">
            <Reveal>
              <h2 className="display-2 font-display whitespace-pre-line text-forest">
                {hairOil.headline}
              </h2>
            </Reveal>

            <Reveal delay={90}>
              <p className="lede pretty mt-6 max-w-md text-muted">{hairOil.lede}</p>
            </Reveal>

            <ul className="mt-10 max-w-md">
              {hairOil.points.map((point, i) => (
                <Reveal
                  as="li"
                  key={point.title}
                  delay={150 + i * 90}
                  className="border-t border-forest/12 py-5"
                >
                  <div className="flex gap-5">
                    <span className="mt-1 font-display text-[0.8125rem] text-botanical/45 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-forest">{point.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {point.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={430} className="mt-10">
              <Button href={routes.hairOil} size="lg" variant="solid">
                {hairOil.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Button>
            </Reveal>

            <Reveal delay={480}>
              <p className="mt-6 max-w-sm text-[0.75rem] leading-relaxed text-muted">
                {hairOil.note}
              </p>
            </Reveal>
          </div>

          {/* Photography — arch primary + offset detail */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative mx-auto max-w-xl lg:max-w-none lg:pl-10">
              <Media
                src="/images/oil-hero.jpg"
                alt="An amber glass dropper bottle of herbal hair oil resting in soft palm-frond shadow"
                className="arch aspect-[4/5] w-full shadow-[0_60px_100px_-55px_rgba(20,54,31,0.55)] sm:aspect-[5/6]"
                sizes="(max-width: 1024px) 92vw, 46vw"
              />

              <div className="absolute -bottom-10 -left-2 w-[38%] max-w-[12rem] sm:-bottom-12 sm:-left-8 lg:left-0">
                <Media
                  src="/images/oil-detail.jpg"
                  alt="A dropper bottle laid on natural linen beside a fresh green leaf"
                  className="arch aspect-[3/4] w-full ring-[10px] ring-sand shadow-[0_30px_60px_-30px_rgba(20,54,31,0.55)]"
                  sizes="(max-width: 640px) 40vw, 200px"
                />
              </div>

              <div className="absolute -right-2 top-8 hidden -translate-y-1/2 sm:top-16 lg:block">
                <span className="eyebrow whitespace-nowrap text-botanical/70 [writing-mode:vertical-rl]">
                  Botanical · Warm · Nourishing
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
