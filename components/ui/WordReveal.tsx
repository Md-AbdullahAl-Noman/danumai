"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Reveals a heading word by word with a masked rise. */
export default function WordReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  accentWords = [],
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  accentWords?: string[];
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top"
        >
          <motion.span
            className={`inline-block ${
              accentWords.includes(word.replace(/[.,]/g, ""))
                ? "text-copper italic"
                : ""
            }`}
            initial={reduce ? { opacity: 0 } : { y: "110%", rotate: 2.5 }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
