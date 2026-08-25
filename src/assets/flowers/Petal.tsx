// Single petal — animatable via className (scale, rotation, translate).
export default function Petal({
  size = 48,
  color = "var(--blush-2)",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="-16 -62 32 66"
      aria-hidden
      className={className}
      style={{ width: size, height: size * 1.6, ...style }}
    >
      <path
        d="M0 -10 C -13 -26, -13 -48, 0 -58 C 13 -48, 13 -26, 0 -10 Z"
        fill={color}
      />
    </svg>
  );
}
