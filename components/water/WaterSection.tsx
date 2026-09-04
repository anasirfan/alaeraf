import { ArrowRight, Droplets } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/visuals/Media";
import { Ripple, WaveEdge } from "@/components/visuals/Ornaments";
import { water } from "@/data/content";
import { routes } from "@/lib/site";

/**
 * THE WATER WORLD — cool mist ground, centred type, a full-bleed cinematic
 * band and a two-image editorial spread. Deliberately airy and horizontal
 * where the botanical section is warm, dense and vertical.
 */
export function WaterSection() {
  return (
    <section id="ro-water" className="relative scroll-mt-20 overflow-hidden bg-mist">
      <WaveEdge
        className="absolute inset-x-0 top-0 h-14 w-full sm:h-20"
        fill="var(--sand)"
        flip
      />

      <Ripple className="pointer-events-none absolute -left-40 top-40 hidden h-[34rem] w-[34rem] text-aqua-deep/[0.08] lg:block" />

      {/* Centred type block */}
      <Container className="relative pt-28 sm:pt-36 lg:pt-44">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex items-center justify-center gap-4">
            <span className="font-display text-2xl text-aqua-deep/40 tabular-nums">
              {water.no}
            </span>
            <span className="h-px w-8 bg-aqua-deep/25" aria-hidden="true" />
            <span className="eyebrow text-aqua-deep">{water.eyebrow}</span>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="display-2 balance mt-7 font-display whitespace-pre-line text-forest">
              {water.headline}
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="lede pretty mx-auto mt-6 max-w-lg text-muted-cool">
              {water.lede}
            </p>
          </Reveal>

          <Reveal delay={210}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {water.badges.map((badge) => (
                <li
                  key={badge}
                  className="eyebrow flex items-center gap-2 text-[0.7rem] text-aqua-deep"
                >
                  <Droplets className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>

      {/* Full-bleed cinematic band — the water world's signature move */}
      <Reveal delay={80} className="relative mt-14 sm:mt-16 lg:mt-20">
        <Media
          src="/images/water-ripple.jpg"
          alt="Sunlight rippling across clear, shallow water"
          className="aspect-[4/3] w-full sm:aspect-[16/7] lg:aspect-[21/7]"
          sizes="100vw"
          quality={78}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-mist to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-mist to-transparent"
          aria-hidden="true"
        />
      </Reveal>

      {/* Editorial pair */}
      <Container className="relative">
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal delay={130} className="col-span-1 lg:col-span-5 lg:mt-28">
            <Media
              src="/images/water-glass.jpg"
              alt="Two Al Aeraf branded RO water bottles against a mountain lake backdrop"
              className="aspect-[3/4] w-full rounded-t-[7rem] rounded-b-sm"
              sizes="(max-width: 1024px) 46vw, 36vw"
            />
            <p className="eyebrow mt-4 text-aqua-deep">Everyday clarity</p>
          </Reveal>

          <Reveal className="col-span-1 lg:col-span-7">
            <Media
              src="/images/water-pour.jpg"
              alt="Close-up of an Al Aeraf RO water bottle neck and label, beaded with condensation"
              className="aspect-[3/4] w-full rounded-t-[7rem] rounded-b-sm lg:aspect-[4/5]"
              sizes="(max-width: 1024px) 46vw, 52vw"
            />
            <p className="eyebrow mt-4 text-aqua-deep">Freshly filtered</p>
          </Reveal>
        </div>

        {/* Stats + CTA */}
        <Reveal
          delay={120}
          className="mt-16 border-t border-line-cool pt-10 pb-20 sm:pb-28 lg:mt-24 lg:pb-32"
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <dl className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-10">
              {water.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-4 sm:block">
                  <dt className="font-display text-3xl text-aqua-deep sm:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-cool sm:mt-2">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Button href={routes.water} size="lg" variant="water" className="self-start">
              {water.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
