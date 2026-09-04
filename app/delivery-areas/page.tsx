import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Steps } from "@/components/ui/Steps";
import { DeliveryArea } from "@/components/delivery-area/DeliveryArea";
import { delivery } from "@/data/content";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery Areas",
  description: delivery.lede,
};

export default function DeliveryAreasPage() {
  return (
    <>
      <DeliveryArea />

      {/* How delivery works */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <Eyebrow>How Delivery Works</Eyebrow>
          <Reveal delay={80}>
            <h2 className="display-2 mt-6 max-w-lg font-display text-forest">
              Getting set up is quick.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Reveal delay={140}>
              <Steps items={delivery.howDelivery} />
            </Reveal>
          </div>

          <Reveal delay={200} className="mt-14 flex flex-col items-start gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
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
