import { Check, Droplets, Leaf, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { why } from "@/data/content";

const icons: Record<string, LucideIcon> = {
  leaf: Leaf,
  droplet: Droplets,
  map: MapPin,
  check: Check,
};

export function WhyAlAeraf() {
  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{why.eyebrow}</Eyebrow>
            <h2 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
              {why.headline}
            </h2>
          </Reveal>
        </div>

        {/* Hairline columns — no boxes, no shadows, no SaaS cards */}
        <div className="mt-14 grid border-y border-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {why.cards.map((card, i) => {
            const Icon = icons[card.icon] ?? Leaf;
            return (
              <Reveal
                key={card.title}
                delay={i * 100}
                className={[
                  "group relative py-8 sm:py-10",
                  "border-b border-line sm:last:border-b-0 lg:border-b-0",
                  i % 2 === 1 ? "sm:border-l sm:border-line sm:pl-8" : "sm:pr-8",
                  "lg:border-l lg:border-b-0 lg:px-8 lg:first:border-l-0 lg:first:pl-0",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon
                    className="h-7 w-7 text-botanical transition-transform duration-500 group-hover:-translate-y-0.5"
                    strokeWidth={1.3}
                  />
                  <span className="font-display text-[0.8125rem] text-botanical/30 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-xl text-forest">{card.title}</h3>
                <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted">
                  {card.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
