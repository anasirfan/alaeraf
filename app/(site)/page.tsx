import { Hero } from "@/components/hero/Hero";
import { BrandStory } from "@/components/brand-story/BrandStory";
import { HairOilSection } from "@/components/hair-oil/HairOilSection";
import { WaterSection } from "@/components/water/WaterSection";
import { SubscriptionSection } from "@/components/subscription/SubscriptionSection";
import { DeliveryArea } from "@/components/delivery-area/DeliveryArea";
import { WhyAlAeraf } from "@/components/why-al-aeraf/WhyAlAeraf";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { FinalCTA } from "@/components/final-cta/FinalCTA";

/**
 * Home stays the full brand overview — every world gets its section here,
 * same as the original single-page site. Each section's CTA hands off to a
 * dedicated route (see app/hair-oil, app/ro-water, etc.) that goes deeper
 * with its own content and its own layout, rather than repeating this page.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandStory />
      <HairOilSection />
      <WaterSection />
      <SubscriptionSection />
      <DeliveryArea />
      <WhyAlAeraf />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
