import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { BrandStory } from "@/components/brand-story/BrandStory";
import { HairOilSection } from "@/components/hair-oil/HairOilSection";
import { WaterSection } from "@/components/water/WaterSection";
import { SubscriptionSection } from "@/components/subscription/SubscriptionSection";
import { DeliveryArea } from "@/components/delivery-area/DeliveryArea";
import { WhyAlAeraf } from "@/components/why-al-aeraf/WhyAlAeraf";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { FinalCTA } from "@/components/final-cta/FinalCTA";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BrandStory />
        <HairOilSection />
        <WaterSection />
        <SubscriptionSection />
        <DeliveryArea />
        <WhyAlAeraf />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
