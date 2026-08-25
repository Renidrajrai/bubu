// Pistil/stamen center — animatable scale for appearance effect.
export default function FlowerCenter({
  size = 18,
  outerColor = "var(--gold)",
  innerColor = "var(--caramel)",
  className = "",
}: {
  size?: number;
  outerColor?: string;
  innerColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <circle cx="10" cy="10" r="9" fill={outerColor} />
      <circle cx="10" cy="10" r="4.5" fill={innerColor} />
    </svg>
  );
}
