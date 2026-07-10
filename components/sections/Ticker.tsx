const items = [
  "BanglaReels",
  "Danumai Studios",
  "Care Technology",
  "Danumai Labs",
];

// A short manifesto lane rides beneath the venture lane, drifting the opposite
// way. Two counter-moving rows read as depth rather than one sliding strip.
const phrases = [
  "Built for ourselves",
  "Operated for the long haul",
  "One roof, one engine",
  "No clients, by design",
];

function Lane({
  words,
  reverse = false,
  className = "",
}: {
  words: string[];
  reverse?: boolean;
  className?: string;
}) {
  const row = [...words, ...words, ...words];
  return (
    <div
      className={`${reverse ? "marquee-rev" : "marquee"} flex w-max items-center gap-12 ${className}`}
    >
      {row.map((item, i) => (
        <span key={i} className="flex items-center gap-12">
          <span className="whitespace-nowrap font-display text-sm tracking-wide">
            {item}
          </span>
          <span className="h-1 w-1 rounded-full bg-copper/50" />
        </span>
      ))}
    </div>
  );
}

/** Two slow counter-drifting lanes separating the hero from the ventures grid.
 *  Hovering the band pauses both lanes together. */
export default function Ticker() {
  return (
    <div
      aria-hidden
      className="group relative flex flex-col gap-3 overflow-hidden border-y section-edge py-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <Lane words={items} className="text-faint" />
      <Lane words={phrases} reverse className="text-faint/60" />
    </div>
  );
}
