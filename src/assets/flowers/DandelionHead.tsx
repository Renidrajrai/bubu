// Spherical dandelion puffball — spokes radiate from center.
// Phase 5 will animate individual spokes for wind effect.
export default function DandelionHead({
  size = 80,
  spokeCount = 12,
  color = "var(--cloud)",
  centerColor = "var(--cocoa-soft)",
  className = "",
}: {
  size?: number;
  spokeCount?: number;
  color?: string;
  centerColor?: string;
  className?: string;
}) {
  const spokes = Array.from({ length: spokeCount }, (_, i) => i * (360 / spokeCount));
  return (
    <svg
      viewBox="-44 -44 88 88"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      {spokes.map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <line
            y2="-30"
            stroke="var(--cocoa-soft)"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <circle
            cy="-34"
            r="3.4"
            fill={color}
            stroke="var(--cocoa-soft)"
            strokeWidth="0.8"
            opacity="0.9"
          />
        </g>
      ))}
      <circle r="7" fill={centerColor} />
    </svg>
  );
}
