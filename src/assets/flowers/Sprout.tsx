// Stem + leaves — used for small plants and background filler.
export default function Sprout({
  height = 60,
  color = "var(--stem-green)",
  leafColor = "var(--leaf-green)",
  flip = false,
  className = "",
}: {
  height?: number;
  color?: string;
  leafColor?: string;
  flip?: boolean;
  className?: string;
}) {
  const w = 60;
  const h = height;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d={`M${w / 2} ${h} C${w / 2} ${h * 0.75}, ${w / 2} ${h * 0.6}, ${w / 2} ${h * 0.45}`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${w / 2} ${h * 0.55} C${w * 0.27} ${h * 0.52}, ${w * 0.17} ${h * 0.38}, ${w * 0.2} ${h * 0.28} C${w * 0.4} ${h * 0.3}, ${w * 0.48} ${h * 0.4}, ${w / 2} ${h * 0.55} Z`}
        fill={color}
      />
      <path
        d={`M${w / 2} ${h * 0.65} C${w * 0.73} ${h * 0.62}, ${w * 0.83} ${h * 0.5}, ${w * 0.8} ${h * 0.38} C${w * 0.6} ${h * 0.42}, ${w * 0.52} ${h * 0.52}, ${w / 2} ${h * 0.65} Z`}
        fill={leafColor}
      />
    </svg>
  );
}
