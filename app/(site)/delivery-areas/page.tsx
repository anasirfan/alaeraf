import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { delivery } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery Areas",
  description: delivery.lede,
};

/**
 * A different shape from the Home teaser's side-by-side map+list: a
 * full-width map banner up top, area tiles in a light grid below it, and a
 * horizontal numbered strip for how delivery works.
 */
export default function DeliveryAreasPage() {
  return (
    <>
      {/* Full-width map banner */}
      <section className="relative h-[52svh] min-h-[22rem] w-full pt-[4.5rem] lg:pt-20">
        <iframe
          title="Al Aeraf delivery area — Nazimabad and nearby, Karachi"
          src="https://maps.google.com/maps?q=Nazimabad,+Karachi,+Pakistan&z=13&output=embed"
          className="h-full w-full border-0 grayscale-[15%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <Container className="pb-6">
            <p className="eyebrow flex items-center gap-2 text-cream/90">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
              Service area — Karachi
            </p>
          </Container>
        </div>
      </section>

      {/* Header + area tiles */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>{delivery.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
                {delivery.headline}
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="lede pretty mt-5 text-muted">{delivery.lede}</p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {delivery.areas.map((area, i) => (
              <Reveal
                key={area}
                delay={100 + i * 60}
                className="flex items-center gap-3 rounded-sm border border-line bg-sand/40 px-5 py-4"
              >
                <MapPin className="h-4 w-4 shrink-0 text-botanical" strokeWidth={1.6} />
                <span className="text-[0.9375rem] text-forest">{area}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={routes.contact} size="lg" variant="solid">
              {delivery.cta}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <p className="text-[0.75rem] text-muted">{delivery.note}</p>
          </Reveal>
        </Container>
      </section>

      {/* How delivery works — horizontal numbered strip */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <Eyebrow>How Delivery Works</Eyebrow>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Getting set up is quick.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 border-t border-forest/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {delivery.howDelivery.map((step, i) => (
              <Reveal key={step.step} delay={100 + i * 90}>
                <span className="font-display text-3xl tabular-nums text-botanical/35">
                  {step.step}
                </span>
                <h3 className="mt-3 font-display text-lg text-forest">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={220}
            className="mt-14 flex flex-col items-start gap-4 border-t border-forest/12 pt-10 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Don&apos;t see your neighbourhood listed yet? We&apos;re adding new areas regularly —
              reach out and we&apos;ll let you know when we cover your street.
            </p>
            <Button href={routes.contact} size="lg" variant="outline">
              Contact Us
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
