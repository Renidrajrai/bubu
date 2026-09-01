// Botanical doodle flower — irregular petals with textured center.
// ponytail: deterministic irregularity, no runtime randomness.
export default function FlowerDoodle({
  size = 28,
  color = "var(--blush-2)",
  centerColor = "var(--gold)",
  className = "",
}: {
  size?: number;
  color?: string;
  centerColor?: string;
  className?: string;
}) {
  const petalAngles = [0, 52, 108, 160, 215, 270, 325];
  const petalSizes = [
    { rx: 4, ry: 7 },
    { rx: 3.5, ry: 6 },
    { rx: 4.2, ry: 7.5 },
    { rx: 3.8, ry: 6.5 },
    { rx: 4, ry: 7.2 },
    { rx: 3.6, ry: 6.3 },
    { rx: 4.1, ry: 7.1 },
  ];

  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      {petalAngles.map((deg, i) => (
        <ellipse
          key={deg}
          cx="14"
          cy={14 - petalSizes[i].ry * 0.55}
          rx={petalSizes[i].rx}
          ry={petalSizes[i].ry}
          fill={color}
          transform={`rotate(${deg} 14 14)`}
          opacity={0.65 + (i % 2) * 0.1}
        />
      ))}
      <circle cx="14" cy="14" r="3.5" fill={centerColor} opacity="0.85" />
      <circle cx="14" cy="14" r="1.5" fill={centerColor} opacity="0.5" />
    </svg>
  );
}
