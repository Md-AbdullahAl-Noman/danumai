import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import SpotlightCard from "@/components/ui/SpotlightCard";

const stats = [
  { value: 3, suffix: "", label: "Ventures in motion" },
  { value: 1, suffix: "", label: "Shared platform beneath them" },
  { value: 300, suffix: "M+", label: "Bangla speakers we build for" },
  { value: 0, suffix: "", label: "Clients — by design" },
];

export default function Stats() {
  return (
    <section className="wash-gold border-t hairline bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-24">
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="h-full">
              <SpotlightCard className="card card-hover card-topline h-full p-4 sm:p-6 md:p-7">
                <span
                  aria-hidden
                  className="mb-3 block text-[11px] font-medium tracking-[0.2em] text-copper/70 sm:mb-6 sm:text-xs"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dd className="font-display text-3xl tracking-tight text-paper sm:text-5xl md:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-xs leading-relaxed text-mist sm:mt-3 sm:text-sm">
                  {s.label}
                </dt>
              </SpotlightCard>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
