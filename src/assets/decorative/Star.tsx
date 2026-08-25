// Simple star accent.
export default function Star({
  size = 20,
  color = "var(--gold)",
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
        d="M12 2.5 14.6 9 21.6 9.6 16.3 14.2 17.9 21.1 12 17.4 6.1 21 7.7 14.2 2.4 9.6 9.4 9Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );
}
