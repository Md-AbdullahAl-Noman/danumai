"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

const capabilities = [
  {
    n: "01",
    title: "Product engineering",
    body: "Full-stack, owned end to end — from the first line of code to what ships in production.",
    tags: ["Web", "Mobile", "Backend"],
  },
  {
    n: "02",
    title: "Shared platform",
    body: "Auth, payments, media, and analytics — built once, hardened continuously, reused by every venture.",
    tags: ["Auth", "Payments", "Media"],
  },
  {
    n: "03",
    title: "Design system",
    body: "One visual language and component library spanning every Danumai product.",
    tags: ["Tokens", "Components", "Motion"],
  },
  {
    n: "04",
    title: "Applied AI",
    body: "Deployed where it earns its keep in the product experience — and nowhere else.",
    tags: ["Recsys", "Tooling", "Search"],
  },
];

export default function Labs() {
  return (
    <section id="labs" className="scroll-mt-24 border-t hairline">
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

        {/* Index — each row materializes as it scrolls in */}
        <div className="mt-16 md:mt-20">
          {capabilities.map((c, i) => (
            <IndexRow
              key={c.n}
              c={c}
              isLast={i === capabilities.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndexRow({
  c,
  isLast,
}: {
  c: (typeof capabilities)[number];
  isLast: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Reveal is scrubbed to this row's own scroll position — scrolling up
  // plays it back in reverse.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.5"],
  });

  // Wipe in from the left with a clip mask.
  const clip = useTransform(scrollYProgress, [0, 0.85], [100, 0]);
  const clipPath = useMotionTemplate`inset(0% 0% 0% ${clip}%)`;
  const y = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  // Index number slides in slightly ahead of the copy.
  const numX = useTransform(scrollYProgress, [0, 0.9], [-24, 0]);
  const numOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <div ref={ref} className="group relative">
      {/* top hairline draws across, filled by scroll progress */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-(--color-hairline)"
      />
      <motion.span
        aria-hidden
        style={reduce ? { scaleX: 1 } : { scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-copper/70"
      />

      <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-4 py-8 md:grid-cols-[5rem_1fr_auto] md:gap-x-10 md:py-11">
        {/* big index */}
        <motion.span
          style={reduce ? undefined : { x: numX, opacity: numOpacity }}
          className="font-display text-2xl italic text-faint transition-colors duration-500 group-hover:text-copper md:text-3xl"
        >
          {c.n}
        </motion.span>

        {/* title + body wipe in together */}
        <motion.div
          style={reduce ? undefined : { clipPath, opacity, y }}
          className="col-span-1"
        >
          <h3 className="font-display text-2xl tracking-tight text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-3xl">
            {c.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            {c.body}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {c.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border hairline px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-faint transition-colors duration-500 group-hover:border-copper/25 group-hover:text-mist"
              >
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* arrow marker */}
        <span
          aria-hidden
          className="col-start-2 row-start-1 justify-self-end text-copper opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 md:col-start-3 md:-translate-x-2 md:self-center md:group-hover:translate-x-0"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </div>

      {isLast && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-(--color-hairline)"
        />
      )}
    </div>
  );
}
