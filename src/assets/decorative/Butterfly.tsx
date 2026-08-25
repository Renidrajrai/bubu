// Simple butterfly accent — hand-drawn style, animatable.
export default function Butterfly({
  size = 32,
  color = "var(--blush)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M16 14 C12 8, 4 6, 4 12 C4 18, 12 20, 16 16"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M16 14 C20 8, 28 6, 28 12 C28 18, 20 20, 16 16"
        fill={color}
        opacity="0.6"
      />
      <line x1="16" y1="10" x2="16" y2="24" stroke="var(--cocoa-soft)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14" cy="9" r="1" fill="var(--cocoa-soft)" />
      <circle cx="18" cy="9" r="1" fill="var(--cocoa-soft)" />
    </svg>
  );
}
