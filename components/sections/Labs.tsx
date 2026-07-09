"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  AppliedAIExhibit,
  DesignSystemExhibit,
  PlatformExhibit,
  ProductExhibit,
} from "./labs/exhibits";

type Capability = {
  n: string;
  title: string;
  body: string;
  tags: readonly string[];
  accent: string;
  /** Cinematic Prism family used on the light canvas. */
  accentLight: string;
  Exhibit: ComponentType<{ accent: string }>;
};

const capabilities: readonly Capability[] = [
  {
    n: "01",
    title: "Product engineering",
    body: "Full-stack, owned end to end — from the first line of code to what ships in production.",
    tags: ["Web", "Mobile", "Backend"],
    accent: "#dda05a",
    accentLight: "#c77c0a", // golden spotlight
    Exhibit: ProductExhibit,
  },
  {
    n: "02",
    title: "Shared platform",
    body: "Auth, payments, media, and analytics — built once, hardened continuously, reused by every venture.",
    tags: ["Auth", "Payments", "Media"],
    accent: "#d98363",
    accentLight: "#e04435", // cinema coral
    Exhibit: PlatformExhibit,
  },
  {
    n: "03",
    title: "Design system",
    body: "One visual language and component library spanning every Danumai product.",
    tags: ["Tokens", "Components", "Motion"],
    accent: "#7bb6a1",
    accentLight: "#0f9168", // emerald studio
    Exhibit: DesignSystemExhibit,
  },
  {
    n: "04",
    title: "Applied AI",
    body: "Deployed where it earns its keep in the product experience — and nowhere else.",
    tags: ["Recsys", "Tooling", "Search"],
    accent: "#8f9bd9",
    accentLight: "#4340bd", // royal indigo
    Exhibit: AppliedAIExhibit,
  },
] as const;

const CYCLE_MS = 5200;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Labs() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Auto-advance through capabilities; pause on hover/focus or reduced motion.
  useEffect(() => {
    if (reduce || paused) return;
    timer.current = setTimeout(
      () => setActive((a) => (a + 1) % capabilities.length),
      CYCLE_MS,
    );
    return clear;
  }, [active, paused, reduce, clear]);

  const select = (i: number) => {
    clear();
    setActive(i);
  };

  const current = capabilities[active];
  // Resolve each capability's hue for the active theme — the light canvas
  // uses the deeper Cinematic Prism families.
  const { theme } = useTheme();
  const hue = (c: Capability) => (theme === "light" ? c.accentLight : c.accent);
  const accent = hue(current);

  return (
    <section id="labs" className="wash-emerald scroll-mt-24 border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                Danumai Labs
              </p>
            </Reveal>
            <WordReveal
              text="The engineering room behind every venture."
              accentWords={["engineering", "room"]}
              className="mt-5 max-w-2xl font-display text-3xl tracking-tight text-paper md:text-5xl"
            />
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              Not a department — the whole company&rsquo;s build capability.
              Product, design, and engineering shipping from one shared
              codebase.
            </p>
          </Reveal>
        </div>

        {/* Interactive console */}
        <Reveal delay={0.15}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-6"
          >
            {/* Left — selectable capability stack */}
            <ul className="flex flex-col gap-2.5">
              {capabilities.map((c, i) => (
                <LayerRow
                  key={c.n}
                  c={c}
                  accent={hue(c)}
                  active={i === active}
                  paused={paused}
                  reduce={!!reduce}
                  onSelect={() => select(i)}
                />
              ))}
            </ul>

            {/* Right — live viewport */}
            <div
              style={{
                borderColor: `${accent}33`,
                background: `radial-gradient(120% 90% at 100% 0%, ${accent}18, transparent 55%), var(--color-surface)`,
                boxShadow: `0 44px 110px -46px var(--app-venture-drop), 0 0 0 1px ${accent}1a inset`,
                transition: "border-color 0.6s ease, background 0.6s ease",
              }}
              className="relative flex min-h-105 flex-col overflow-hidden rounded-3xl border p-4 sm:p-5 md:p-6"
            >
              {/* chrome bar */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span
                  className="ml-2 font-display text-[11px] tracking-[0.16em] transition-colors duration-500"
                  style={{ color: accent }}
                >
                  labs/{current.title.toLowerCase().replace(/ /g, "-")}
                </span>
                <span className="ml-auto text-[10px] tabular-nums text-faint">
                  {current.n} / {String(capabilities.length).padStart(2, "0")}
                </span>
              </div>

              {/* exhibit stage */}
              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.n}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0"
                  >
                    <current.Exhibit accent={accent} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LayerRow({
  c,
  accent,
  active,
  paused,
  reduce,
  onSelect,
}: {
  c: Capability;
  accent: string;
  active: boolean;
  paused: boolean;
  reduce: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        style={{
          borderColor: active ? `${accent}4d` : "var(--color-hairline)",
          background: active
            ? `radial-gradient(140% 100% at 0% 0%, ${accent}16, transparent 60%), var(--color-surface)`
            : "transparent",
        }}
        className="group relative block w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 hover:border-paper/15"
      >
        {/* active accent rail */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] origin-top transition-transform duration-500"
          style={{
            background: accent,
            transform: `scaleY(${active ? 1 : 0})`,
          }}
        />
        {/* auto-advance progress underline */}
        {active && !reduce && !paused && (
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-px"
            style={{ background: accent }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
          />
        )}

        <div className="flex items-baseline gap-3">
          <span
            className="font-display text-sm italic transition-colors duration-500"
            style={{ color: active ? accent : "var(--color-faint)" }}
          >
            {c.n}
          </span>
          <h3
            className="font-display text-lg tracking-tight transition-colors duration-500 md:text-xl"
            style={{
              color: active ? "var(--color-paper)" : "var(--color-mist)",
            }}
          >
            {c.title}
          </h3>
          <span
            aria-hidden
            className="ml-auto translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: accent, opacity: active ? 1 : undefined }}
          >
            →
          </span>
        </div>

        {/* body + tags reveal only when active — keeps the stack calm */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            gridTemplateRows: active ? "1fr" : "0fr",
            opacity: active ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
              {c.body}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-mist"
                  style={{
                    borderColor: `${accent}2e`,
                    background: `${accent}0d`,
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </button>
    </li>
  );
}
