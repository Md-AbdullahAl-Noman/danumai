"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Dark/light switch. Sun and moon crossfade with a short rotate/scale so the
 * change reads as one physical object turning over, not two icons swapping.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border hairline text-mist transition-colors duration-300 hover:border-copper/40 hover:text-copper ${className}`}
    >
      {/* soft accent halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-copper/0 transition-colors duration-300 group-hover:bg-copper/10"
      />
      <span className="relative block h-[18px] w-[18px]">
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute inset-0 h-full w-full"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -60, scale: 0.5 }
              }
              animate={
                reduce ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }
              }
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, rotate: 60, scale: 0.5 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute inset-0 h-full w-full"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -60, scale: 0.5 }
              }
              animate={
                reduce ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }
              }
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, rotate: 60, scale: 0.5 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
