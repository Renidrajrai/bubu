// Unopened bud (teardrop) — animatable scale/opacity for swelling effect.
export default function Bud({
  size = 20,
  color = "var(--blush)",
  stemColor = "var(--sage)",
  className = "",
}: {
  size?: number;
  color?: string;
  stemColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 30"
      aria-hidden
      className={className}
      style={{ width: size, height: size * 1.5 }}
    >
      <path
        d="M10 28 C10 20 6 14 6 10 C6 4 14 4 14 10 C14 14 10 20 10 28Z"
        fill={color}
      />
      <path
        d="M10 28 C10 22 10 18 10 14"
        stroke={stemColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
