import PetalRing from "./PetalRing";
import FlowerCenter from "./FlowerCenter";

// Assembled flower head — petals + center. Scroll-linked reveal.
export default function FlowerHead({
  petalCount = 5,
  petalSize = 36,
  radius = 24,
  petalColor = "var(--blush-2)",
  centerSize = 16,
  className = "",
}: {
  petalCount?: number;
  petalSize?: number;
  radius?: number;
  petalColor?: string;
  centerSize?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={`relative flex items-center justify-center ${className}`}>
      <PetalRing
        count={petalCount}
        petalSize={petalSize}
        radius={radius}
        color={petalColor}
      />
      <FlowerCenter size={centerSize} className="absolute" />
    </div>
  );
}
