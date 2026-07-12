"use client";

import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { DEFAULT_CONTENT, type ServicesContent, type ServiceCategory } from "@/lib/content";

export default function Services({
  content = DEFAULT_CONTENT.services,
}: {
  content?: ServicesContent;
}) {
  const categories = content.categories;
  if (categories.length === 0) return null;

  return (
    <section id="services" className="wash-gold scroll-mt-24 border-t section-edge">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {content.eyebrow}
              </p>
            </Reveal>
            <WordReveal
              text={content.heading}
              accentWords={content.accentWords}
              className="mt-5 max-w-2xl font-display text-3xl tracking-tight text-paper md:text-5xl"
            />
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-md text-sm leading-relaxed text-mist">
              {content.intro}
            </p>
          </Reveal>
        </div>

        {/* Catalogue grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.n} delay={0.06 * i}>
              <ServiceCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ c }: { c: ServiceCategory }) {
  return (
    <SpotlightCard
      style={{ "--card-accent": c.accent } as React.CSSProperties}
      className="card card-hover card-topline flex h-full flex-col p-6 md:p-7"
    >
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-sm italic"
          style={{ color: c.accent }}
        >
          {c.n}
        </span>
        <h3 className="font-display text-xl tracking-tight text-paper md:text-2xl">
          {c.title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-mist">{c.body}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {c.items.map((item) => (
          <li
            key={item}
            className="rounded-full border px-3 py-1 text-[11px] tracking-[0.04em] text-mist transition-colors duration-300"
            style={{
              borderColor: `${c.accent}2e`,
              background: `${c.accent}0d`,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}
