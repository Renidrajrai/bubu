import Petal from "./Petal";

// Configurable petal ring — count, radius, stagger.
// Each petal is positioned around a center point.
export default function PetalRing({
  count = 5,
  petalSize = 40,
  radius = 28,
  color = "var(--blush-2)",
  className = "",
}: {
  count?: number;
  petalSize?: number;
  radius?: number;
  color?: string;
  className?: string;
}) {
  const angleStep = 360 / count;
  return (
    <div
      aria-hidden
      className={`relative ${className}`}
      style={{ width: radius * 2 + petalSize, height: radius * 2 + petalSize }}
    >
      {Array.from({ length: count }, (_, i) => {
        const deg = i * angleStep;
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * radius;
        const y = -Math.cos(rad) * radius;
        return (
          <Petal
            key={i}
            size={petalSize}
            color={color}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${deg}deg)`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
