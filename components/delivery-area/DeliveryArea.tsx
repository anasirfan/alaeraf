import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { delivery } from "@/data/content";
import { routes } from "@/lib/site";

/**
 * Real Google Map, centred on the delivery neighbourhoods. This is a plain
 * `output=embed` iframe — no API key, no client JS, no address lookup or
 * geolocation. It is a static reference map, not a live coverage checker.
 */
function ServiceAreaMap() {
  return (
    <iframe
      title="Al Aeraf delivery area — Nazimabad and nearby, Karachi"
      src="https://maps.google.com/maps?q=Nazimabad,+Karachi,+Pakistan&z=13&output=embed"
      className="h-full w-full rounded-sm border-0 grayscale-[15%]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function DeliveryArea() {
  return (
    <section id="delivery" className="relative scroll-mt-20 overflow-hidden bg-forest text-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(109,154,125,0.22),transparent_60%)]"
        aria-hidden="true"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow tone="light">{delivery.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="display-2 mt-6 font-display whitespace-pre-line text-cream">
                {delivery.headline}
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="lede pretty mt-6 max-w-md text-cream/65">{delivery.lede}</p>
            </Reveal>

            <Reveal delay={220}>
              <ul className="mt-10 grid gap-x-8 border-t border-cream/15 sm:grid-cols-2">
                {delivery.areas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-3 border-b border-cream/12 py-3.5"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-sage-soft" strokeWidth={1.6} />
                    <span className="text-[0.9375rem] text-cream/85">{area}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href={routes.deliveryAreas} size="lg" variant="light">
                {delivery.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </Button>
              <p className="text-[0.75rem] text-cream/65">{delivery.note}</p>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-6">
            <div className="relative mx-auto max-w-md rounded-sm border border-cream/12 bg-ink/40 p-3 sm:p-4 lg:max-w-none">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-[5/4]">
                <ServiceAreaMap />
              </div>
              <div className="mt-5 flex items-center justify-between px-2 pb-1">
                <span className="eyebrow text-cream/60">Service area</span>
                <span className="eyebrow text-sage-soft/70">Karachi</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
