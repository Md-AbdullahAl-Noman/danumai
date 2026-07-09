const items = [
  "BanglaReels",
  "Danumai Studios",
  "Care Technology",
  "Danumai Labs",
];

/** Slow infinite ticker separating hero from the ventures grid. */
export default function Ticker() {
  const row = [...items, ...items, ...items];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y hairline py-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="marquee flex w-max items-center gap-12">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="whitespace-nowrap font-display text-sm tracking-wide text-faint">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-copper/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
