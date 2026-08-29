import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hero } from "@/data/content";
import { site } from "@/lib/site";

/** Slow water beads tracing down the right of the frame — the only motion here. */
function Beads() {
  const beads = [
    { left: "12%", top: "16%", delay: "0s", size: 5 },
    { left: "34%", top: "40%", delay: "1.9s", size: 4 },
    { left: "63%", top: "24%", delay: "3.2s", size: 6 },
    { left: "85%", top: "54%", delay: "4.6s", size: 4 },
  ];
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[26%] lg:block"
      aria-hidden="true"
    >
      {beads.map((b) => (
        <span
          key={b.left}
          className="anim-bead absolute rounded-full bg-white/70"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size * 1.25,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Background photography */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-leaf.jpg"
          alt="A broad green leaf covered in fresh rain droplets"
          fill
          priority
          quality={78}
          sizes="100vw"
          className="anim-fade object-cover object-[64%_40%] sm:object-[58%_42%]"
        />
        {/* Directional scrim — keeps the photograph breathing while type stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 sm:via-ink/52" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/28 to-transparent" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
      </div>

      <Beads />

      {/* Vertical brand rule — editorial furniture, large screens only */}
      <div
        className="pointer-events-none absolute left-6 top-0 hidden h-full flex-col items-center gap-5 pt-28 xl:flex"
        aria-hidden="true"
      >
        <span className="h-24 w-px bg-gradient-to-b from-transparent to-cream/25" />
        <span className="eyebrow whitespace-nowrap text-cream/35 [writing-mode:vertical-rl]">
          {site.tagline}
        </span>
        <span className="h-full w-px bg-gradient-to-b from-cream/25 to-transparent" />
      </div>

      {/* Copy block */}
      <Container className="relative flex flex-1 flex-col justify-end pt-24 pb-7 sm:pt-32 sm:pb-10">
        <div className="max-w-3xl">
          <p className="anim-rise eyebrow flex items-center gap-3 text-sage-soft/80">
            <span className="h-px w-8 bg-sage-soft/45" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1 className="anim-rise d-1 display-1 mt-5 font-display text-cream sm:mt-8">
            {hero.headline[0]}
            <br />
            <span className="text-sage-soft">{hero.headline[1]}</span>
          </h1>

          <p className="anim-rise d-2 lede mt-5 max-w-lg text-cream/70 sm:mt-8">
            {hero.lede}
          </p>
        </div>

        <div
          className="anim-fade d-5 mt-10 hidden items-center gap-3 lg:flex"
          aria-hidden="true"
        >
          <span className="eyebrow text-cream/30">Scroll</span>
          <span className="relative h-px w-16 overflow-hidden bg-cream/20">
            <span className="absolute inset-y-0 left-0 w-6 animate-[drift_3.4s_ease-in-out_infinite] bg-cream/70" />
          </span>
        </div>
      </Container>

      {/* Editorial index — the two product worlds, deliberately held apart */}
      <div className="anim-rise d-3 relative border-t border-cream/15">
        <Container>
          <ul className="grid sm:grid-cols-2">
            {hero.index.map((item, i) => (
              <li
                key={item.no}
                className={
                  i === 0
                    ? "border-b border-cream/12 sm:border-b-0 sm:border-r sm:border-cream/15 sm:pr-8"
                    : "sm:pl-8"
                }
              >
                <a
                  href={item.href}
                  className="group flex items-center gap-4 py-4 transition-opacity duration-300 hover:opacity-80 sm:items-start sm:gap-5 sm:py-7"
                >
                  <span className="font-display text-sm text-cream/35 tabular-nums sm:pt-1">
                    {item.no}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-sage-soft/80">
                      {item.kicker}
                    </span>
                    <span className="mt-1.5 block font-display text-lg leading-tight text-cream sm:mt-2 sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="mt-1.5 hidden text-[0.8125rem] leading-relaxed text-cream/65 sm:block">
                      {item.note}
                    </span>
                    <span className="mt-3 hidden items-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.06em] text-sage-soft uppercase sm:inline-flex">
                      {item.cta}
                    </span>
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/25 text-cream transition-all duration-300 group-hover:border-cream/60 group-hover:bg-cream group-hover:text-forest sm:mt-1 sm:h-10 sm:w-10">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    <span className="sr-only">{item.cta}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
