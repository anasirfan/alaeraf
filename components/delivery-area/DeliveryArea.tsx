import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { delivery } from "@/data/content";
import { routes } from "@/lib/site";

/**
 * Location-inspired illustration — not a real map.
 * When the RO plant coordinates and 5 km radius go live, this is the only
 * visual that needs replacing.
 */
function CoverageMap() {
  const blocks = [
    [26, 30, 58, 34], [96, 22, 74, 30], [186, 34, 52, 44],
    [30, 82, 46, 52], [90, 68, 84, 40], [188, 92, 62, 30],
    [24, 148, 66, 38], [104, 122, 54, 56], [176, 138, 74, 44],
    [40, 202, 88, 34], [146, 196, 62, 48], [222, 178, 42, 60],
  ];
  const pins = [
    { x: 112, y: 96 }, { x: 168, y: 128 }, { x: 92, y: 168 },
    { x: 186, y: 84 }, { x: 140, y: 196 },
  ];

  return (
    <svg viewBox="0 0 280 260" className="h-auto w-full" role="img" aria-label="Illustrative map of the Al Aeraf delivery neighbourhoods">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--sage)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* street blocks */}
      <g opacity="0.5">
        {blocks.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="3"
            fill="var(--sage-soft)"
            opacity={0.07 + (i % 3) * 0.025}
            stroke="var(--sage-soft)"
            strokeOpacity="0.12"
          />
        ))}
      </g>

      {/* arterial roads */}
      <g stroke="var(--sage-soft)" strokeOpacity="0.16" strokeWidth="1.2" fill="none">
        <path d="M0 118h280M132 0v260M0 60C70 66 120 40 190 52s70 6 90 0" />
      </g>

      {/* coverage radius */}
      <circle cx="140" cy="130" r="104" fill="url(#glow)" />
      {[52, 78, 104].map((r, i) => (
        <circle
          key={r}
          cx="140"
          cy="130"
          r={r}
          fill="none"
          stroke="var(--sage-soft)"
          strokeOpacity={0.5 - i * 0.13}
          strokeWidth="1"
          strokeDasharray={i === 2 ? "5 6" : undefined}
        />
      ))}

      {/* neighbourhood markers */}
      {pins.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--sage-soft)" opacity="0.7" />
      ))}

      {/* plant */}
      <circle cx="140" cy="130" r="12" fill="var(--cream)" opacity="0.14" />
      <circle cx="140" cy="130" r="5.5" fill="var(--cream)" />
    </svg>
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
            <div className="relative mx-auto max-w-md rounded-sm border border-cream/12 bg-ink/40 p-6 sm:p-9 lg:max-w-none">
              <CoverageMap />
              <div className="mt-6 flex items-center justify-between border-t border-cream/12 pt-5">
                <span className="eyebrow text-cream/60">Illustrative coverage</span>
                <span className="eyebrow text-sage-soft/70">Karachi</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
