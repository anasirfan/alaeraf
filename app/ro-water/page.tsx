import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Steps } from "@/components/ui/Steps";
import { WaterSection } from "@/components/water/WaterSection";
import { water } from "@/data/content";

export const metadata: Metadata = {
  title: "RO Drinking Water",
  description: water.lede,
};

export default function RoWaterPage() {
  return (
    <>
      <WaterSection />

      {/* How it's made */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <Eyebrow tone="water">How It&apos;s Made</Eyebrow>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              From source to your door.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Reveal delay={140}>
              <Steps items={water.process} tone="water" lgCols={5} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Eyebrow tone="water">FAQs</Eyebrow>
            <Reveal delay={80}>
              <h2 className="display-2 mt-6 font-display text-forest">
                Questions about the water.
              </h2>
            </Reveal>
            <Reveal delay={140} className="mt-10">
              <Faq items={water.faq} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
