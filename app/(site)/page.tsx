import Hero from "@/components/Hero";
import Ticker from "@/components/sections/Ticker";
import VentureShowcase from "@/components/sections/VentureShowcase";
import Stats from "@/components/sections/Stats";
import Approach from "@/components/sections/Approach";
import Labs from "@/components/sections/Labs";
import Manifesto from "@/components/sections/Manifesto";
import CTA from "@/components/sections/CTA";
import { listProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Falls back to VentureShowcase's built-in defaults if the database isn't
  // reachable (e.g. DATABASE_URL not configured yet), so the site still renders.
  const projects = await listProjects().catch((err) => {
    console.error("Failed to load projects", err);
    return undefined;
  });

  return (
    <>
      <Hero />
      <Ticker />
      <VentureShowcase projects={projects} />
      <Stats />
      <Approach />
      <Labs />
      <Manifesto />
      <CTA />
    </>
  );
}
