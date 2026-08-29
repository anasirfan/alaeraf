import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function CategoryCards() {
  return (
    <section id="categories" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="mt-4 font-display text-3xl text-forest sm:text-4xl">
            Two essentials. One brand.
          </h2>
          <p className="mt-4 text-muted">
            Explore herbal hair care and pure RO water — each crafted with the
            same commitment to quality.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Hair Care */}
          <article className="group relative overflow-hidden rounded-[2rem] bg-cream shadow-sm ring-1 ring-forest/8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
            <div className="relative h-52 overflow-hidden sm:h-60">
              <Image
                src="/images/hair-oil.jpg"
                alt="Herbal hair oil bottle"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
            </div>
            <div className="relative p-8 sm:p-10">
              <SectionLabel>Hair Care</SectionLabel>
              <h3 className="mt-3 font-display text-2xl text-forest sm:text-3xl">
                Herbal care inspired by nature.
              </h3>
              <p className="mt-3 max-w-sm text-muted">
                A premium herbal hair oil experience designed for everyday
                nourishment and mindful self-care.
              </p>
              <Button href="#hair-oil" className="mt-8" size="md">
                Explore Hair Oil
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </article>

          {/* RO Water */}
          <article className="group relative overflow-hidden rounded-[2rem] bg-mist shadow-sm ring-1 ring-water/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
            <div className="relative h-52 overflow-hidden sm:h-60">
              <Image
                src="/images/water-bottle.jpg"
                alt="Pure RO water bottle"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mist via-mist/20 to-transparent" />
            </div>
            <div className="relative p-8 sm:p-10">
              <SectionLabel tone="water">RO Water</SectionLabel>
              <h3 className="mt-3 font-display text-2xl text-forest sm:text-3xl">
                Pure drinking water, delivered to your doorstep.
              </h3>
              <p className="mt-3 max-w-sm text-muted">
                Fresh RO water for your home — clean, simple, and reliably
                delivered across our service areas.
              </p>
              <Button href="#water" className="mt-8" size="md">
                Order Water
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
