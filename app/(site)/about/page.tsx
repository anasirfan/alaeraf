import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/visuals/Media";
import { brandStory } from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description: brandStory.body[0],
};

const CHAPTERS_MEDIA = [
  { src: "/images/oil-hero.jpg", alt: "Al Aeraf herbal hair oil bottles" },
  { src: "/images/water-glass.jpg", alt: "Al Aeraf RO water bottles" },
  { src: "/images/leaves-dark.jpg", alt: "Botanical leaves, close up" },
];

/**
 * A vertical "story" page — a full-bleed title header, then alternating
 * image/text chapters and a closing pull-quote. Deliberately not the
 * side-by-side arch layout Home's BrandStory teaser uses.
 */
export default function AboutPage() {
  return (
    <>
      {/* Full-bleed story header */}
      <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/brand-duo.jpg"
          alt="Al Aeraf herbal hair oil and Al Aeraf RO water bottles together"
          fill
          priority
          quality={78}
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        <Container className="relative pt-[7.5rem] pb-14 sm:pb-20">
          <Reveal>
            <Eyebrow tone="light">{brandStory.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-1 mt-6 max-w-2xl font-display whitespace-pre-line text-cream">
              {brandStory.headline}
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* Opening body copy — full width, generous measure */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl space-y-5">
            {brandStory.body.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <p className="lede pretty text-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Chapters — alternating image/text rows, one per approach point */}
      <section className="bg-sand py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="space-y-20 sm:space-y-28">
            {brandStory.approach.map((item, i) => {
              const imageRight = i % 2 === 0;
              return (
                <div
                  key={item.title}
                  className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
                >
                  <Reveal
                    className={`lg:col-span-5 ${imageRight ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <Media
                      src={CHAPTERS_MEDIA[i % CHAPTERS_MEDIA.length].src}
                      alt={CHAPTERS_MEDIA[i % CHAPTERS_MEDIA.length].alt}
                      className="aspect-[4/3] w-full rounded-sm"
                      sizes="(max-width: 1024px) 92vw, 40vw"
                    />
                  </Reveal>
                  <Reveal
                    delay={100}
                    className={`lg:col-span-7 ${imageRight ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <span className="font-display text-sm tabular-nums text-botanical/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="display-3 mt-3 max-w-md font-display text-forest">
                      {item.title}
                    </h2>
                    <p className="lede pretty mt-4 max-w-md text-muted">{item.body}</p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Closing pull-quote */}
      <section className="bg-forest py-24 text-cream sm:py-32">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="light" className="justify-center">
              A Note From Al Aeraf
            </Eyebrow>
            <p className="display-3 balance mt-7 font-display text-cream">{brandStory.promise}</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
