"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CharReveal from "@/components/ui/CharReveal";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduce = useReducedMotion();

  // Mouse-driven ambient parallax (springed so it settles, never snaps).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20, mass: 1.2 });
  const smy = useSpring(my, { stiffness: 50, damping: 20, mass: 1.2 });
  const lightX = useTransform(smx, (v) => v * 60);
  const lightY = useTransform(smy, (v) => v * 40);
  const textX = useTransform(smx, (v) => v * -8);
  const textY = useTransform(smy, (v) => v * -5);

  // Scroll-driven exit: hero content drifts up and dims as you leave it.
  const { scrollY } = useScroll();
  const exitY = useTransform(scrollY, [0, 700], [0, -90]);
  const exitOpacity = useTransform(scrollY, [0, 600], [1, 0.25]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const { innerWidth, innerHeight } = window;
    mx.set(e.clientX / innerWidth - 0.5);
    my.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      {/* Aurora + grid substrate */}
      <div aria-hidden className="aurora" />
      <div aria-hidden className="absolute inset-0 bg-grid" />

      {/* Ambient light field — follows the cursor, breathes on its own */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: lightX, y: lightY }}
        className="absolute inset-0"
      >
        <motion.div
          className="absolute right-[-10%] top-[-15%] h-[70vh] w-[70vw] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(217,154,78,0.11), transparent 70%)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] h-[55vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(217,154,78,0.06), transparent 70%)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { x: textX, y: textY }}
        className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10"
      >
        <motion.div style={{ y: exitY, opacity: exitOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-ink-2/60 py-1.5 pl-2.5 pr-4 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-mist">
              Danumai Inc. — building in 2026
            </span>
          </motion.div>

          <CharReveal
            text="A house of ventures, built and operated under one roof."
            accentWords={["ventures", "one", "roof"]}
            delay={0.35}
            className="mt-6 max-w-4xl font-display text-4xl leading-[1.08] tracking-tight text-paper sm:text-6xl md:text-7xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            We don&rsquo;t build for clients. We build streaming, stories, and
            care technology for ourselves — engineered in-house by Danumai
            Labs, and run for the long haul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
            className="relative z-10 mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              href="#ventures"
              strength={0.15}
              className="glow-copper sheen group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-medium text-ink transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-copper-soft"
            >
              Explore the ventures
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </MagneticButton>

            <MagneticButton
              href="#approach"
              strength={0.12}
              className="group relative z-10 inline-flex items-center gap-2 rounded-full border border-hairline bg-ink px-6 py-3 text-sm font-medium text-mist backdrop-blur-sm transition-[color,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-paper/20 hover:bg-ink-2 hover:text-paper"
            >
              How we work
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-faint">
          Scroll
        </span>
        <span className="relative block h-9 w-px overflow-hidden bg-paper/10">
          <motion.span
            className="absolute left-0 top-0 h-3 w-px bg-copper"
            animate={reduce ? undefined : { y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
