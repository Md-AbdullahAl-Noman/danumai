"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { CareArt, ReelsArt, StudiosArt } from "./showcase/artworks";

const ventures = [
  {
    index: "01",
    name: "BanglaReels",
    tagline: "Short-form streaming for the Bangla-speaking world",
    description:
      "A vertical micro-drama platform built for how 300 million people actually watch — serialized stories, episode by episode, in their own language.",
    status: "In development",
    features: ["Vertical serials", "Episode unlocks", "Creator tooling", "Offline-first"],
    accent: "#dda05a",
    Art: ReelsArt,
  },
  {
    index: "02",
    name: "Danumai Studios",
    tagline: "Original stories, produced in-house",
    description:
      "The content engine behind our platforms. We write, produce, and own the serials we stream — no licensing, no middlemen, full creative control.",
    status: "In development",
    features: ["Writers' room", "Vertical-first production", "Owned IP", "Fast cycles"],
    accent: "#d98363",
    Art: StudiosArt,
  },
  {
    index: "03",
    name: "Care Technology",
    tagline: "Software for the people who look after people",
    description:
      "Tools that give caregivers time back — scheduling, coordination, and communication built around the realities of care work, not around billing codes.",
    status: "Research",
    features: ["Shift coordination", "Family updates", "Care logs", "Gentle reminders"],
    accent: "#7bb6a1",
    Art: CareArt,
  },
];

const N = ventures.length;

export default function VentureShowcase() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  // Progress through the card list — drives each card's arrival, dwell,
  // and settle-back entirely via JS transforms (see DeckCard below).
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Ventures</p>
        </Reveal>
        <WordReveal
          text="Three bets, one conviction."
          accentWords={["bets", "conviction"]}
          className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-paper md:text-5xl"
        />
      </div>
      <Reveal delay={0.25}>
        <p className="max-w-xs text-sm leading-relaxed text-mist">
          Each venture stands on the same in-house platform — and each one is a
          product we run ourselves.
        </p>
      </Reveal>
    </div>
  );

  // Reduced-motion / no-JS-friendly fallback: a plain stacked list.
  if (reduce) {
    return (
      <section id="ventures" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          {header}
          <div className="mt-14 flex flex-col gap-8">
            {ventures.map((v) => (
              <VentureCard key={v.name} v={v} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ventures" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 pt-24 md:px-10 md:pt-32">
        {header}
      </div>

      {/* Scroll-driven deck: one pinned, vertically centered stage. Cards
          are positioned by JS scroll progress so stacking, dwell and
          release are exact. Track height = travel budget, no dead scroll. */}
      <div
        ref={listRef}
        style={{ height: `${TRACK_UNITS * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="relative h-108 sm:h-120 md:h-[min(30rem,72svh)]">
              {ventures.map((v, i) => (
                <DeckCard key={v.name} v={v} i={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- deck timing ----------
   The track is measured in "units" (1 unit ≈ 100vh of scroll). Each
   incoming card gets TRAVEL units of movement plus DWELL units at rest,
   so the deck finishes with a short hold and releases without dead space. */
const TRAVEL = 0.7;
const DWELL = 0.35;
const CHUNK = TRAVEL + DWELL;
const TRACK_UNITS = (N - 1) * CHUNK; // e.g. 2.1 → 210vh for 3 cards

const ENTER_FROM = 620; // px below its slot a card starts
const PEEK = 16; // px of tinted top edge each buried card shows
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// How far card j (j ≥ 1) has travelled into place, 0..1.
const arrival = (p: number, j: number) =>
  j <= 0 ? 1 : clamp01((p * TRACK_UNITS - (j - 1) * CHUNK) / TRAVEL);

function DeckCard({
  v,
  i,
  progress,
}: {
  v: (typeof ventures)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  // Depth = how many later cards have landed on top (continuous 0..N-1-i).
  // The front card is always full size; buried cards recede up + back so
  // only their tinted top edge peeks above the card in front.
  const y = useTransform(progress, (p) => {
    const enter = i === 0 ? 0 : (1 - arrival(p, i)) * ENTER_FROM;
    let depth = 0;
    for (let j = i + 1; j < N; j++) depth += arrival(p, j);
    return enter - depth * PEEK;
  });
  const scale = useTransform(progress, (p) => {
    let depth = 0;
    for (let j = i + 1; j < N; j++) depth += arrival(p, j);
    return 1 - depth * 0.04;
  });
  const dim = useTransform(progress, (p) => {
    let depth = 0;
    for (let j = i + 1; j < N; j++) depth += arrival(p, j);
    return Math.min(0.55, depth * 0.38);
  });

  return (
    <motion.div
      style={{ y, scale, zIndex: i + 1 }}
      className="absolute inset-0 origin-top will-change-transform"
    >
      <div className="relative h-full">
        <VentureCard v={v} />
        {/* veil: buried cards read clearly as behind, tint still visible */}
        <motion.div
          aria-hidden
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 rounded-3xl bg-ink"
        />
      </div>
    </motion.div>
  );
}

/* ---------- the venture card itself ---------- */
function VentureCard({ v }: { v: (typeof ventures)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      style={{
        borderColor: `${v.accent}33`,
        background: `radial-gradient(120% 90% at 100% 0%, ${v.accent}22, transparent 55%), linear-gradient(160deg, ${v.accent}14, transparent 46%), var(--color-surface)`,
        boxShadow: `0 44px 110px -42px rgba(0,0,0,0.9), 0 1px 0 0 rgba(241,236,228,0.05) inset, 0 0 0 1px ${v.accent}1a inset`,
      }}
      className="group relative grid h-full grid-cols-1 gap-4 overflow-hidden rounded-3xl border p-4 sm:gap-6 sm:p-5 md:grid-cols-2 md:gap-8 md:p-6"
    >
      {/* accent spotlight that trails the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${v.accent}24, transparent 62%)`,
        }}
      />

      {/* accent hairline along the top edge — what peeks when stacked */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)`,
        }}
      />

      {/* Art */}
      <div className="relative z-10 h-32 overflow-hidden rounded-2xl border hairline bg-ink-3 sm:h-44 md:h-full md:max-h-80">
        <v.Art />
        <span
          className="absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm"
          style={{
            borderColor: `${v.accent}40`,
            color: v.accent,
            background: "rgba(12,11,9,0.6)",
          }}
        >
          {v.status}
        </span>
      </div>

      {/* Copy */}
      <div className="relative z-10 flex flex-col justify-center">
        <span className="font-display text-xs" style={{ color: v.accent }}>
          {v.index}
        </span>
        <h3 className="mt-1.5 font-display text-xl tracking-tight text-paper sm:text-2xl md:mt-2 md:text-[1.75rem]">
          {v.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: `${v.accent}cc` }}>
          {v.tagline}
        </p>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-mist line-clamp-3 md:mt-3 md:line-clamp-none">
          {v.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5 sm:gap-2 md:mt-5">
          {v.features.map((f) => (
            <li
              key={f}
              className="rounded-full border px-3 py-1 text-xs text-mist transition-colors sm:px-3.5 sm:py-1.5"
              style={{
                borderColor: `${v.accent}26`,
                background: `${v.accent}0d`,
              }}
            >
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={`/contact?topic=${encodeURIComponent(v.name)}`}
          className="group mt-4 inline-flex w-fit items-center gap-2 text-sm transition-colors md:mt-6"
          style={{ color: v.accent }}
        >
          Discuss this venture
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
