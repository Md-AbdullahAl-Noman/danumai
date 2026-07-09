"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

const principles = [
  {
    n: "01",
    title: "We build for ourselves",
    body: "No client work, no agencies, no retainers. Every product we ship is one we own and operate — which means we live with every decision we make.",
  },
  {
    n: "02",
    title: "We operate what we build",
    body: "Shipping is the start, not the finish. The same team that engineers a product runs it in the market, so feedback loops are measured in days, not quarters.",
  },
  {
    n: "03",
    title: "One roof, shared engine",
    body: "Streaming, stories, and care technology look unrelated until you see the machinery underneath — shared infrastructure, shared design language, shared conviction.",
  },
  {
    n: "04",
    title: "Patience over hype",
    body: "We pick markets we understand deeply and commit for years. Compounding beats momentum, in products as in everything else.",
  },
];

export default function Approach() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  // Timeline spine grows with reading position.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section id="approach" className="scroll-mt-24 border-t hairline bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                Approach
              </p>
            </Reveal>
            <WordReveal
              text="The way we choose to work."
              accentWords={["choose"]}
              className="mt-5 font-display text-3xl tracking-tight text-paper md:text-4xl"
            />
          </div>

          <div className="relative">
            {/* Growing spine */}
            <div
              aria-hidden
              className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/8"
            />
            <motion.div
              aria-hidden
              style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
              className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-copper/60"
            />

            <ol ref={listRef} className="space-y-0">
              {principles.map((p, i) => (
                <li key={p.n} className="relative pl-12">
                  <motion.span
                    aria-hidden
                    initial={reduce ? { opacity: 0 } : { scale: 0 }}
                    whileInView={reduce ? { opacity: 1 } : { scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.15,
                    }}
                    className="absolute left-0 top-[0.4em] block h-[15px] w-[15px] rounded-full border border-copper/60 bg-ink-2"
                  >
                    <span className="absolute inset-[4px] rounded-full bg-copper" />
                  </motion.span>
                  <motion.div
                    initial={
                      reduce ? { opacity: 0 } : { opacity: 0, x: 32 }
                    }
                    whileInView={
                      reduce ? { opacity: 1 } : { opacity: 1, x: 0 }
                    }
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pb-14"
                  >
                    <span className="font-display text-sm text-copper">
                      {p.n}
                    </span>
                    <h3 className="mt-2 font-display text-xl tracking-tight text-paper md:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
                      {p.body}
                    </p>
                  </motion.div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
