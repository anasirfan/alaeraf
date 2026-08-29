import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WaveEdge } from "@/components/visuals/Ornaments";
import { subscription } from "@/data/content";
import { routes } from "@/lib/site";

export function SubscriptionSection() {
  return (
    <section id="subscription" className="relative scroll-mt-20 overflow-hidden bg-ivory">
      <WaveEdge
        className="absolute inset-x-0 top-0 h-12 w-full sm:h-16"
        fill="var(--mist)"
        flip
      />

      <Container className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow tone="water">{subscription.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
                {subscription.headline}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-5">
            <p className="lede pretty max-w-md text-muted-cool">{subscription.lede}</p>
          </Reveal>
        </div>

        {/* Plans — one shared frame with dividers, not three floating cards */}
        <div className="mt-14 grid overflow-hidden rounded-sm border border-line-cool sm:mt-16 lg:grid-cols-3">
          {subscription.plans.map((plan, i) => (
            <Reveal
              key={plan.name}
              delay={i * 110}
              className={[
                "flex flex-col p-7 sm:p-9",
                i > 0 ? "border-t border-line-cool lg:border-l lg:border-t-0" : "",
                plan.featured ? "bg-forest text-cream" : "bg-white",
              ].join(" ")}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`font-display text-2xl ${plan.featured ? "text-cream" : "text-forest"}`}
                  >
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="eyebrow shrink-0 rounded-full border border-cream/30 px-3 py-1.5 text-cream/80">
                      Popular
                    </span>
                  )}
                </div>
                <p
                  className={`eyebrow mt-3 ${plan.featured ? "text-sage-soft" : "text-aqua-deep"}`}
                >
                  {plan.for}
                </p>
              </div>

              <p
                className={`mt-5 text-sm leading-relaxed ${plan.featured ? "text-cream/70" : "text-muted-cool"}`}
              >
                {plan.detail}
              </p>

              <ul className="mt-7 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-sage-soft" : "text-sage"}`}
                      strokeWidth={2}
                    />
                    <span
                      className={`text-sm leading-relaxed ${plan.featured ? "text-cream/85" : "text-muted"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button
                  href={routes.subscription}
                  variant={plan.featured ? "light" : "outline"}
                  className="w-full"
                >
                  {subscription.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-6 text-center text-[0.75rem] tracking-[0.04em] text-muted">
            {subscription.disclaimer}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
