// Botanical yellow dandelion (Taraxacum) flower — many thin ray petals,
// green involucre base, textured center disc. Animatable via scale/opacity.
// ponytail: all values pre-computed and rounded to avoid SSR hydration mismatch.

const r = (n: number) => Math.round(n * 1000) / 1000;

const petalAngles = [0, 52, 108, 160, 215, 270, 325];
const PETAL_COUNT = 20;

// Pre-compute all petal geometry as static arrays
const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
  const angle = r((i / PETAL_COUNT) * 360);
  const len = r(18 + (i % 3) * 2);
  const width = r(2.5 + (i % 2) * 0.8);
  const shade = i % 2 === 0 ? "var(--yellow-flower)" : "var(--yellow-flower-dark)";
  const opacity = i % 3 === 0 ? 0.9 : i % 3 === 1 ? 0.8 : 0.75;
  return { angle, len, width, shade, opacity };
});

export default function YellowFlower({
  size = 80,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="-40 -44 80 88"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      {/* green involucre (calyx / bracts) at base */}
      <g opacity="0.7">
        <path d="M-4 8 C-6 4, -3 0, 0 -2 C3 0, 6 4, 4 8 Z" fill="var(--stem-green)" />
        <path d="M-6 6 C-8 2, -5 -1, -1 -3 C2 -1, 5 2, 3 6 Z" fill="var(--stem-green)" opacity="0.5" />
        <path d="M6 6 C8 2, 5 -1, 1 -3 C-2 -1, -5 2, -3 6 Z" fill="var(--stem-green)" opacity="0.5" />
      </g>

      {/* ray petals — pre-computed paths */}
      {petals.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = r(Math.cos(rad));
        const dy = r(Math.sin(rad));
        const tipDx = r(dx * p.len);
        const tipDy = r(dy * p.len);
        const perpX = r(-dy);
        const perpY = r(dx);
        const w = p.width;

        return (
          <path
            key={i}
            d={`M0 0 C${r(perpX * w * 0.3)} ${r(perpY * w * 0.3 - 2)}, ${r(tipDx * 0.3 + perpX * w * 0.6)} ${r(tipDy * 0.3 + perpY * w * 0.6 - 3)}, ${tipDx} ${tipDy} C${r(tipDx * 0.3 - perpX * w * 0.6)} ${r(tipDy * 0.3 - perpY * w * 0.6 - 3)}, ${r(-perpX * w * 0.3)} ${r(-perpY * w * 0.3 - 2)}, 0 0 Z`}
            fill={p.shade}
            opacity={p.opacity}
          />
        );
      })}

      {/* center disc */}
      <circle cx="0" cy="0" r="6" fill="var(--gold)" opacity="0.9" />
      <circle cx="0" cy="0" r="2.8" fill="var(--yellow-flower-dark)" opacity="0.5" />
      <circle cx="-2" cy="-1.5" r="1.5" fill="var(--yellow-flower-dark)" opacity="0.4" />
      <circle cx="2" cy="-1" r="1.3" fill="var(--yellow-flower-dark)" opacity="0.4" />
      <circle cx="0.5" cy="2" r="1.4" fill="var(--yellow-flower-dark)" opacity="0.4" />
    </svg>
  );
}
