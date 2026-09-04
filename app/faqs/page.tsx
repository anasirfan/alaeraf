import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { faqPage, hairOil, water, subscription } from "@/data/content";

export const metadata: Metadata = {
  title: "FAQs",
  description: faqPage.lede,
};

const groups = [
  { title: "Herbal Hair Oil", tone: "dark" as const, items: hairOil.faq },
  { title: "RO Drinking Water", tone: "water" as const, items: water.faq },
  { title: "Subscription", tone: "water" as const, items: subscription.faq },
];

export default function FaqsPage() {
  return (
    <section className="bg-ivory pt-[7.5rem] pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{faqPage.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-2 mt-6 font-display whitespace-pre-line text-forest">
              {faqPage.headline}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede pretty mx-auto mt-6 max-w-lg text-muted">{faqPage.lede}</p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-14">
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={100 + i * 80}>
              <Eyebrow tone={group.tone === "water" ? "water" : "dark"}>{group.title}</Eyebrow>
              <div className="mt-6">
                <Faq items={group.items} />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
