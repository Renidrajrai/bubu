// Single leaf — animatable via className (rotate, scale, opacity).
export default function Leaf({
  size = 24,
  color = "var(--sage)",
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
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      style={{ width: size, height: size, transform: `rotate(${rotation}deg)`, ...style }}
    >
      <path
        d="M12 2C6 2 2 8 2 14c0 2 2 6 10 8 8-2 10-6 10-8C22 8 18 2 12 2Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M12 6v12"
        stroke="var(--cream)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
