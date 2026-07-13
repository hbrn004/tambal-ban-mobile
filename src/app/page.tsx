import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Estimator from "@/components/Estimator";
import HowToOrder from "@/components/HowToOrder";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Location from "@/components/Location";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Pricing />
      <Estimator />
      <Location />
      <HowToOrder />
      <FAQ />
      <CTA />
    </>
  );
}
