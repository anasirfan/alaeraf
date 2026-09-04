import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Steps } from "@/components/ui/Steps";
import { HairOilSection } from "@/components/hair-oil/HairOilSection";
import { hairOil } from "@/data/content";

export const metadata: Metadata = {
  title: "Herbal Hair Oil",
  description: hairOil.lede,
};

export default function HairOilPage() {
  return (
    <>
      <HairOilSection />

      {/* Ingredients */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow>What&apos;s Inside</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Ingredients on the label.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede pretty mt-5 max-w-xl text-muted">
              As printed on the bottle — a short, deliberate list rather than a long one.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {hairOil.ingredients.map((ing, i) => (
              <Reveal key={ing.name} delay={180 + i * 70} className="border-t border-line pt-5">
                <h3 className="font-display text-lg text-forest">{ing.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{ing.note}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How to use */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow>How To Use</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              A simple evening routine.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Reveal delay={140}>
              <Steps items={hairOil.howToUse} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <Eyebrow>FAQs</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-6 font-display text-forest">
                Questions about the oil.
              </h2>
            </Reveal>
            <Reveal delay={140} className="mt-10">
              <Faq items={hairOil.faq} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
