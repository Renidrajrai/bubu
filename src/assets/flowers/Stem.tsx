// Simple curved stem — accepts height and curve direction as props.
export default function Stem({
  height = 80,
  curve = 0,
  color = "var(--stem-green)",
  strokeWidth = 3,
  className = "",
}: {
  height?: number;
  curve?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const mid = height / 2;
  return (
    <svg
      viewBox={`0 0 60 ${height}`}
      aria-hidden
      className={className}
      style={{ width: "auto", height: "100%" }}
    >
      <path
        d={`M30 ${height} C${30 + curve} ${mid}, ${30 - curve} ${mid}, 30 0`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
