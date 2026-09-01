import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import BrandLogoCarousel from "@/components/BrandLogoCarousel";
import Pricing from "@/components/Pricing";
import Estimator from "@/components/Estimator";
import Location from "@/components/Location";
import ConfirmationSection from "@/components/ConfirmationSection";
import CancellationPolicy from "@/components/CancellationPolicy";
import ConfirmationBadge from "@/components/ConfirmationBadge";
import HowToOrder from "@/components/HowToOrder";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <BrandLogoCarousel />
      <Pricing />
      <Estimator />
      <Location />
      <ConfirmationSection />
      <CancellationPolicy />
      <ConfirmationBadge />
      <HowToOrder />
      <FAQ />
      <CTA />
    </>
  );
}
