"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SubmitButton, { type SubmitState } from "@/components/ui/SubmitButton";

const topics = [
  "General",
  "BanglaReels",
  "Danumai Studios",
  "Care Technology",
  "Careers",
  "Press",
];

export default function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("topic");
  const [topic, setTopic] = useState(
    preset && topics.includes(preset) ? preset : "General"
  );
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    setState("loading");
    // No backend yet — we compose the mail in the visitor's own client.
    const subject = `[${topic}] Message from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    setTimeout(() => {
      window.location.href = `mailto:hello@danumai.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setState("success");
    }, 900);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div role="radiogroup" aria-label="Topic" className="flex flex-wrap gap-2">
        {topics.map((t) => {
          const selected = t === topic;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTopic(t)}
              className={`relative rounded-full px-4 py-2 text-xs transition-colors duration-300 ${
                selected ? "text-ink" : "text-mist hover:text-paper"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="topic-pill"
                  className="absolute inset-0 rounded-full bg-copper"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative ${selected ? "" : "rounded-full"}`}
              >
                {t}
              </span>
              {!selected && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border hairline"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-xs uppercase tracking-[0.15em] text-faint">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What's on your mind?"
          className="field resize-y"
        />
      </div>

      <SubmitButton
        state={state}
        idleLabel="Send message"
        successLabel="Opening your mail app…"
      />
      <p className="text-xs leading-relaxed text-faint">
        Sends via your own mail client to hello@danumai.com — nothing is
        stored on this site.
      </p>
    </form>
  );
}
