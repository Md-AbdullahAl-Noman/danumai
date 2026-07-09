import LineReveal from "@/components/ui/LineReveal";
import Reveal from "@/components/ui/Reveal";

export default function Manifesto() {
  return (
    <section className="wash-violet relative overflow-hidden border-t section-edge">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, var(--app-ambient-glow), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:px-10 md:py-20">
        <Reveal y={0}>
          <span
            aria-hidden
            className="font-display text-6xl leading-none text-copper/40"
          >
            &ldquo;
          </span>
        </Reveal>
        <blockquote className="mt-4 font-display text-2xl leading-snug tracking-tight text-paper sm:text-4xl md:text-[2.75rem]">
          <LineReveal
            lines={[
              "Most companies rent their future",
              "from someone else's roadmap.",
            ]}
          />
          <LineReveal
            lines={["We decided to own ours."]}
            delay={0.24}
            lineClassName="accent-word"
          />
        </blockquote>

        <Reveal delay={0.45}>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-copper/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-copper" />
            <span className="h-px w-10 bg-linear-to-l from-transparent to-copper/50" />
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-faint">
            The Danumai principle
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
            Every product under this roof is one we conceived, built, and
            still run ourselves — no client briefs, no borrowed vision.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
