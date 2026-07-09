import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: 3, suffix: "", label: "Ventures in motion" },
  { value: 1, suffix: "", label: "Shared platform beneath them" },
  { value: 300, suffix: "M+", label: "Bangla speakers we build for" },
  { value: 0, suffix: "", label: "Clients — by design" },
];

export default function Stats() {
  return (
    <section className="border-t hairline bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="h-full">
              <div className="card card-hover card-topline group h-full p-6 md:p-7">
                <span
                  aria-hidden
                  className="mb-6 block text-xs font-medium tracking-[0.2em] text-copper/70"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dd className="font-display text-5xl tracking-tight text-paper md:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 text-sm leading-relaxed text-mist">
                  {s.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
