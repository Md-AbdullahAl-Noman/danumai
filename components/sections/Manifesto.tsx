import LineReveal from "@/components/ui/LineReveal";
import Reveal from "@/components/ui/Reveal";

export default function Manifesto() {
  return (
    <section className="wash-violet relative overflow-hidden border-t hairline">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, rgba(217,154,78,0.07), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center md:px-10 md:py-40">
        <Reveal y={0}>
          <span
            aria-hidden
            className="font-display text-6xl leading-none text-copper/40"
          >
            &ldquo;
          </span>
        </Reveal>
        <LineReveal
          as="blockquote"
          lines={[
            "Most companies rent their future",
            "from someone else's roadmap.",
            "We decided to own ours.",
          ]}
          className="mt-4 font-display text-2xl leading-snug tracking-tight text-paper sm:text-4xl md:text-[2.75rem]"
        />
        <Reveal delay={0.5}>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-faint">
            The Danumai principle
          </p>
        </Reveal>
      </div>
    </section>
  );
}
