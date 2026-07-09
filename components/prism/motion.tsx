"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

/** One easing family choreographs the entire page. */
export const GLIDE = [0.22, 1, 0.36, 1] as const;

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: GLIDE },
  },
};

/** Scroll-triggered rise-and-settle for a single block. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
} & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: GLIDE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its `riseItem` children as they enter view. */
export function Stagger({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLMotionProps<"div">) {
  return (
    <motion.div className={className} variants={riseItem} {...rest}>
      {children}
    </motion.div>
  );
}
