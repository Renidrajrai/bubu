// Botanical leaf — slightly serrated / lobed edges with midrib + lateral veins.
// ponytail: all geometry is static SVG, no runtime math.
export default function Leaf({
  size = 24,
  color = "var(--leaf-green)",
  rotation = 0,
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 28"
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size * 1.17,
        transform: `rotate(${rotation}deg)`,
        ...style,
      }}
    >
      {/* leaf shape — slightly lobed dandelion-style */}
      <path
        d="M12 2 C10 3, 7 4, 5 7 C4 9, 3 11, 3.5 13 C4 15, 5.5 15, 7 13.5
           C8 12, 9 11, 10 10.5 C10.5 12, 10 14, 9.5 16
           C9 18, 8.5 20, 9 22 C9.5 24, 11 26, 12 27
           C13 26, 14.5 24, 15 22 C15.5 20, 15 18, 14.5 16
           C14 14, 13.5 12, 14 10.5 C15 11, 16 12, 17 13.5
           C18.5 15, 20 15, 20.5 13 C21 11, 20 9, 19 7
           C17 4, 14 3, 12 2Z"
        fill={color}
        opacity="0.85"
      />
      {/* midrib */}
      <path
        d="M12 4 L12 24"
        stroke="var(--cream)"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
      {/* lateral veins */}
      <path d="M12 8 L8 6" stroke="var(--cream)" strokeWidth="0.3" opacity="0.25" fill="none" />
      <path d="M12 8 L16 6" stroke="var(--cream)" strokeWidth="0.3" opacity="0.25" fill="none" />
      <path d="M12 13 L7 11" stroke="var(--cream)" strokeWidth="0.3" opacity="0.2" fill="none" />
      <path d="M12 13 L17 11" stroke="var(--cream)" strokeWidth="0.3" opacity="0.2" fill="none" />
      <path d="M12 18 L9 17" stroke="var(--cream)" strokeWidth="0.3" opacity="0.15" fill="none" />
      <path d="M12 18 L15 17" stroke="var(--cream)" strokeWidth="0.3" opacity="0.15" fill="none" />
    </svg>
  );
}
