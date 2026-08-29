import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { serviceAreas } from "@/data/content";

export function ServiceArea() {
  return (
    <section id="service-area" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--forest) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 -translate-y-1/2 text-mint"
        aria-hidden="true"
      >
        <MapPin className="h-48 w-48 sm:h-64 sm:w-64" strokeWidth={0.75} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Service Areas</SectionLabel>
          <h2 className="mt-4 font-display text-3xl text-forest sm:text-4xl">
            Delivered close to home.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Al Aeraf currently focuses on local neighborhoods — bringing pure
            water and herbal care where you live. Coverage continues to expand.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
          {serviceAreas.map((area) => (
            <li key={area}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-ivory px-4 py-2.5 text-sm font-medium text-charcoal shadow-sm transition-colors hover:border-sage/50 hover:bg-mint/40">
                <MapPin className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
                {area}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button href="#final-cta" variant="secondary" size="lg">
            Check Your Area
          </Button>
          <p className="mt-3 text-xs text-muted">
            Area availability will be verified during checkout in a future
            update.
          </p>
        </div>
      </div>
    </section>
  );
}
