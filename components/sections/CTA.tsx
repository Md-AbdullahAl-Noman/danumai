import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

export default function CTA() {
  return (
    <section className="wash-coral border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40 text-center md:px-10 md:pb-32 md:pt-56">
        <WordReveal
          text="Building something that belongs under this roof?"
          accentWords={["roof"]}
          className="mx-auto max-w-3xl font-display text-3xl tracking-tight text-paper md:text-5xl"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-mist">
            We&rsquo;re always talking to engineers, storytellers, and
            operators who want to build for the long haul.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/careers"
              className="glow-copper sheen beam beam-always group inline-flex items-center gap-2 rounded-full bg-copper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-copper-soft"
            >
              See open roles
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </MagneticButton>
            <MagneticButton
              href="/contact"
              className="sheen inline-block rounded-full border hairline px-7 py-3.5 text-sm text-paper transition-colors hover:border-copper/40 hover:text-copper-soft"
            >
              Start a conversation
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
