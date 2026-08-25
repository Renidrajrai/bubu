// Single dandelion seed with pappus — animatable along path.
export default function Seed({
  size = 24,
  bodyColor = "var(--cocoa-soft)",
  pappusColor = "#e8d9c8",
  className = "",
}: {
  size?: number;
  bodyColor?: string;
  pappusColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
    >
      <line x1="12" y1="14" x2="12" y2="4" stroke={pappusColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="8" x2="6" y2="3.5" stroke={pappusColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="8" x2="18" y2="3.5" stroke={pappusColor} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="12" cy="17.5" rx="2.6" ry="4.5" fill={bodyColor} />
    </svg>
  );
}
