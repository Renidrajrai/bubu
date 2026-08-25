import Leaf from "./Leaf";

// 2–3 leaves at a node with configurable stagger.
export default function LeafCluster({
  count = 2,
  size = 20,
  color = "var(--sage)",
  className = "",
}: {
  count?: number;
  size?: number;
  color?: string;
  className?: string;
}) {
  const angles = count === 3 ? [-35, 0, 35] : [-25, 25];
  return (
    <div aria-hidden className={`flex items-center justify-center ${className}`}>
      {angles.slice(0, count).map((rot, i) => (
        <Leaf
          key={i}
          size={size}
          color={color}
          rotation={rot}
          className="absolute"
          style={{ opacity: 0.9 - i * 0.05 } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
