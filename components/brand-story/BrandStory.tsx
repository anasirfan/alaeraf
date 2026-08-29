import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/visuals/Media";
import { Branch } from "@/components/visuals/Ornaments";
import { brandStory } from "@/data/content";

export function BrandStory() {
  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden bg-ivory py-20 sm:py-28 lg:py-36">
      <Branch
        className="pointer-events-none absolute -right-16 top-8 hidden h-[36rem] w-auto text-botanical/[0.07] lg:block"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image — arch frame, the botanical world's signature shape */}
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <Media
                src="/images/botanical-shadow.jpg"
                alt="Soft daylight casting fern shadows across a warm plaster wall"
                className="arch-soft aspect-[4/5] w-full shadow-[0_50px_90px_-50px_rgba(20,54,31,0.5)]"
                sizes="(max-width: 1024px) 92vw, 40vw"
                imgClassName="object-[55%_50%]"
              />
              <span
                className="absolute -bottom-10 -right-10 hidden h-28 w-28 rounded-full border border-line lg:block"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7 lg:pl-4">
            <Reveal>
              <Eyebrow>{brandStory.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
                {brandStory.headline}
              </h2>
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
  );
}
