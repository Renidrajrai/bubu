// Botanical dandelion seed head — ~55 pappus filaments radiating from dense center.
// ponytail: ALL geometry pre-computed as static arrays with rounded values.
// Zero runtime trig — avoids SSR hydration mismatch.
const r = (n: number) => Math.round(n * 1000) / 1000;

type Line = { x1: number; y1: number; x2: number; y2: number };
type FilamentLine = Line & { opacity: number; strokeW: number };
type SeedEllipse = { cx: number; cy: number; opacity: number };

// Pre-compute ALL lines as static data
const allLines: FilamentLine[] = [];
const allSeeds: SeedEllipse[] = [];
const allFanLines: FilamentLine[] = [];

function addFilament(angleDeg: number, length: number, opts: { strokeW: number; opacity: number; fanCount?: number; fanSpread?: number }) {
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = r(-Math.sin(rad) * length);
  const tipY = r(Math.cos(rad) * length);

  allLines.push({ x1: 0, y1: 0, x2: tipX, y2: tipY, opacity: opts.opacity, strokeW: opts.strokeW });

  // Pappus fan at tip
  if (opts.fanCount && opts.fanSpread) {
    const spread = opts.fanSpread;
    for (let j = 0; j < opts.fanCount; j++) {
      const fanAngle = angleDeg - spread / 2 + (j / (opts.fanCount - 1 || 1)) * spread;
      const fanRad = (fanAngle * Math.PI) / 180;
      const fanLen = r(3 + (j % 2) * 1.5);
      allFanLines.push({
        x1: tipX,
        y1: tipY,
        x2: r(tipX + Math.cos(fanRad) * fanLen),
        y2: r(tipY + Math.sin(fanRad) * fanLen),
        opacity: 0.6 + (j % 2) * 0.2,
        strokeW: 0.3,
      });
    }
  }

  // Seed body on mid+outer
  if (length > 20) {
    allSeeds.push({ cx: r(tipX * 0.85), cy: r(tipY * 0.85), opacity: 0.5 });
  }
}

// Inner filaments — dense, short
for (let i = 0; i < 22; i++) {
  addFilament(r((i / 22) * 360), r(14 + (i % 4) * 2), {
    strokeW: r(0.45 + (i % 3) * 0.07),
    opacity: r(0.25 + (i % 5) * 0.06),
  });
}

// Mid filaments — some with pappus
for (let i = 0; i < 18; i++) {
  addFilament(r((i / 18) * 360), r(22 + (i % 4) * 2.5), {
    strokeW: r(0.4 + (i % 3) * 0.05),
    opacity: r(0.35 + (i % 4) * 0.08),
    fanCount: i % 3 === 0 ? 3 : undefined,
    fanSpread: i % 3 === 0 ? r(8 + (i % 3) * 2) : undefined,
  });
}

// Outer filaments — long, all with pappus fans
for (let i = 0; i < 15; i++) {
  addFilament(r((i / 15) * 360), r(30 + (i % 4) * 3), {
    strokeW: r(0.35 + (i % 3) * 0.05),
    opacity: r(0.5 + (i % 4) * 0.1),
    fanCount: 4 + (i % 3),
    fanSpread: r(8 + (i % 3) * 3),
  });
}

export default function DandelionHead({
  size = 80,
  color = "var(--pappus)",
  centerColor = "var(--cocoa-soft)",
  className = "",
}: {
  size?: number;
  color?: string;
  centerColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      {/* filament stalks */}
      {allLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={centerColor}
          strokeWidth={l.strokeW}
          strokeLinecap="round"
          opacity={l.opacity}
        />
      ))}

      {/* pappus fan lines */}
      {allFanLines.map((l, i) => (
        <line
          key={`f${i}`}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={color}
          strokeWidth={l.strokeW}
          strokeLinecap="round"
          opacity={l.opacity}
        />
      ))}

      {/* seed bodies */}
      {allSeeds.map((s, i) => (
        <ellipse
          key={`s${i}`}
          cx={s.cx} cy={s.cy}
          rx={1} ry={1.6}
          fill={centerColor}
          opacity={s.opacity}
        />
      ))}

      {/* dense center */}
      <circle r="4" fill={centerColor} opacity="0.8" />
      <circle r="2" fill={centerColor} opacity="0.5" />
    </svg>
  );
}
