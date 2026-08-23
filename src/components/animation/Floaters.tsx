// Ambient floating glyphs across the whole page (reference design).
// Deterministic values — stays a server component.
const FLOATERS = [
  { glyph: "♡", left: "4vw", delay: "0s", dur: "14s", drift: "-24px", size: "16px" },
  { glyph: "🐾", left: "18vw", delay: "3s", dur: "17s", drift: "18px", size: "18px" },
  { glyph: "✦", left: "33vw", delay: "7s", dur: "12s", drift: "-10px", size: "14px" },
  { glyph: "⋆", left: "48vw", delay: "1.5s", dur: "19s", drift: "26px", size: "20px" },
  { glyph: "♡", left: "63vw", delay: "9s", dur: "15s", drift: "-18px", size: "15px" },
  { glyph: "🐾", left: "76vw", delay: "5s", dur: "13s", drift: "12px", size: "17px" },
  { glyph: "✦", left: "88vw", delay: "11s", dur: "18s", drift: "-28px", size: "14px" },
  { glyph: "⋆", left: "95vw", delay: "2s", dur: "16s", drift: "8px", size: "18px" },
];

export default function Floaters() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="float-up absolute -bottom-10 opacity-0"
          style={
            {
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.dur,
              "--drift": f.drift,
              fontSize: f.size,
            } as React.CSSProperties
          }
        >
          {f.glyph}
        </span>
      ))}
    </div>
  );
}
