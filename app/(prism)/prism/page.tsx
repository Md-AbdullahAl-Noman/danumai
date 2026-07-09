import PrismNav from "@/components/prism/PrismNav";
import Hero from "@/components/prism/Hero";
import Ticker from "@/components/prism/Ticker";
import Showcase from "@/components/prism/Showcase";
import Studios from "@/components/prism/Studios";
import Timeline from "@/components/prism/Timeline";
import Testimonials from "@/components/prism/Testimonials";
import Gallery from "@/components/prism/Gallery";
import Careers from "@/components/prism/Careers";
import Contact from "@/components/prism/Contact";
import PrismFooter from "@/components/prism/PrismFooter";

export default function PrismPage() {
  return (
    <>
      <PrismNav />
      <main>
        <Hero />
        <Ticker />
        <Showcase />
        <Studios />
        <Timeline />
        <Testimonials />
        <Gallery />
        <Careers />
        <Contact />
      </main>
      <PrismFooter />
    </>
  );
}
