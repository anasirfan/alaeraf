import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DropGlyph, LeafGlyph } from "@/components/visuals/Ornaments";
import { finalCta } from "@/data/content";

export function FinalCTA() {
  return (
    <section id="order" className="relative isolate scroll-mt-20 overflow-hidden bg-ink">
      <Image
        src="/images/leaves-dark.jpg"
        alt=""
        aria-hidden="true"
        fill
        quality={62}
        sizes="100vw"
        className="object-cover object-center opacity-[0.45]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/58 to-ink/88" aria-hidden="true" />
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" aria-hidden="true" />

      <LeafGlyph className="anim-drift pointer-events-none absolute left-6 bottom-10 hidden h-28 w-auto rotate-[-16deg] text-cream/15 lg:block xl:left-16 xl:h-36" />
      <DropGlyph className="anim-drift pointer-events-none absolute right-8 top-16 hidden h-16 w-auto text-cream/15 lg:block xl:right-20 xl:h-20 [animation-delay:2.5s]" />

      <Container className="relative py-24 text-center sm:py-32 lg:py-40">
        <Reveal>
          <span className="eyebrow text-sage-soft/70">Al Aeraf</span>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="display-2 balance mx-auto mt-7 max-w-3xl font-display whitespace-pre-line text-cream">
            {finalCta.headline}
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="lede pretty mx-auto mt-6 max-w-md text-cream/60">
            {finalCta.lede}
          </p>
        </Reveal>

        <Reveal delay={230}>
          <div className="mt-11 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href={finalCta.primary.href} size="lg" variant="light">
              {finalCta.primary.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Button>
            <Button href={finalCta.secondary.href} size="lg" variant="lightOutline">
              {finalCta.secondary.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
