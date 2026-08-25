// Simple doodle flower — decorative accent (§109).
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
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="14"
          cy="6"
          rx="4"
          ry="6"
          fill={color}
          transform={`rotate(${deg} 14 14)`}
          opacity="0.75"
        />
      ))}
      <circle cx="14" cy="14" r="3.5" fill={centerColor} />
    </svg>
  );
}
