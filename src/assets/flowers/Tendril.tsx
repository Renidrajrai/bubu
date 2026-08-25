// Decorative curl/tendril — used for endings and connector accents.
export default function Tendril({
  size = 40,
  color = "var(--sage)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M20 38 C20 28 12 22 12 16 C12 10 18 6 22 10 C26 14 20 18 16 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
