import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/content";

/**
 * Structured so real, permissioned quotes can be dropped straight into
 * `testimonials.items` later. Demo status is stated on the page, not hidden.
 */
export function Testimonials() {
  return (
    <section className="bg-ivory py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{testimonials.eyebrow}</Eyebrow>
            <h2 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
              {testimonials.headline}
            </h2>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6 lg:pb-2">
            <p className="max-w-sm text-sm leading-relaxed text-muted lg:ml-auto lg:text-right">
              <span className="eyebrow mr-2 rounded-full border border-line px-2.5 py-1 text-gold">
                Demo
              </span>
              {testimonials.disclaimer}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid border-t border-line lg:mt-16 lg:grid-cols-3">
          {testimonials.items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 110}
              className={[
                "flex flex-col border-b border-line py-9",
                i > 0 ? "lg:border-l lg:border-line lg:pl-9" : "lg:pr-9",
                i === 1 ? "lg:px-9" : "",
              ].join(" ")}
            >
              <span
                className="font-display text-4xl leading-none text-botanical/25"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <blockquote className="mt-4 flex-1">
                <p className="font-display text-lg leading-[1.5] text-forest sm:text-xl">
                  {item.quote}
                </p>
              </blockquote>

              <footer className="mt-7 border-t border-line pt-5">
                <p className="text-sm font-semibold text-forest">{item.name}</p>
                <p className="mt-1 text-[0.75rem] tracking-[0.04em] text-muted">
                  {item.meta}
                </p>
              </footer>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
