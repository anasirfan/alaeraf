import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FullBackground } from "@/components/visuals/ProductPhoto";

export function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <FullBackground src="/images/bg-botanical.jpg" overlay="forest" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="animate-float-slow relative h-20 w-16 overflow-hidden rounded-xl shadow-lg ring-1 ring-ivory/30 sm:h-24 sm:w-20">
            <Image
              src="/images/hair-oil.jpg"
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="animate-float relative h-20 w-16 overflow-hidden rounded-xl shadow-lg ring-1 ring-ivory/30 [animation-delay:0.5s] sm:h-24 sm:w-20">
            <Image
              src="/images/water-bottle.jpg"
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
          Bring a little more nature into your everyday.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ivory/80 leading-relaxed">
          Whether you&apos;re looking for herbal hair care or pure RO water —
          Al Aeraf is here to deliver purity, simply.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href="#hair-oil"
            className="bg-ivory text-forest hover:bg-cream"
            size="lg"
          >
            Shop Hair Oil
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="#water" variant="outline-light" size="lg">
            Order Water
          </Button>
        </div>
      </div>
    </section>
  );
}
