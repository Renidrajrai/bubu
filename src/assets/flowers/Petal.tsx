// Single botanical petal — slightly asymmetric, with subtle vein.
// ponytail: asymmetry is baked into the path, not runtime.
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
      viewBox="-10 -52 20 56"
      aria-hidden
      className={className}
      style={{ width: size, height: size * 1.6, ...style }}
    >
      {/* asymmetric petal shape — left curve slightly different from right */}
      <path
        d="M0 -4 C -2.5 -14, -3.5 -26, -2 -38 C -1 -44, 0 -48, 0 -48 C 0 -48, 1 -44, 2 -38 C 3.5 -26, 2.5 -14, 0 -4 Z"
        fill={color}
      />
      {/* subtle center vein */}
      <line
        x1="0" y1="-6" x2="0" y2="-42"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
