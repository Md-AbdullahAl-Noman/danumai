import Hero from "@/components/Hero";
import Ticker from "@/components/sections/Ticker";
import VentureShowcase from "@/components/sections/VentureShowcase";
import Stats from "@/components/sections/Stats";
import Approach from "@/components/sections/Approach";
import Labs from "@/components/sections/Labs";
import Manifesto from "@/components/sections/Manifesto";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <VentureShowcase />
      <Stats />
      <Approach />
      <Labs />
      <Manifesto />
      <CTA />
    </>
  );
}
