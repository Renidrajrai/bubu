// Simple heart accent.
export default function Heart({
  size = 24,
  color = "var(--rose)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M12 20.5C5.5 15 3.5 10.8 6.2 7.9c1.9-2 4.3-1.2 5.8 1 .1.2.4.2.5 0 1.5-2.2 3.9-3 5.8-1 2.7 2.9.7 7.1-6.3 12.6Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );
}
