import { Hero } from "@/components/hero/Hero";
import { BrandStory } from "@/components/brand-story/BrandStory";
import { WhyAlAeraf } from "@/components/why-al-aeraf/WhyAlAeraf";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { FinalCTA } from "@/components/final-cta/FinalCTA";

/**
 * Home is a hub, not the whole story. Each product and program gets its own
 * dedicated route with detailed content; this page introduces both worlds
 * and hands off via Hero's index, BrandStory's pillars and FinalCTA.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandStory />
      <WhyAlAeraf />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
