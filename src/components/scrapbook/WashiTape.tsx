// Decorative washi tape — patterned strip for scrapbook aesthetic.
export default function WashiTape({
  width = 80,
  color = "var(--blush)",
  pattern = "dots",
  className = "",
}: {
  width?: number;
  color?: string;
  pattern?: "dots" | "stripes" | "solid";
  className?: string;
}) {
  const patternId = `washi-${pattern}`;
  return (
    <div
      aria-hidden
      className={`h-5 rounded-sm ${className}`}
      style={{ width, backgroundColor: `${color}90` }}
    >
      <svg width="100%" height="100%" aria-hidden>
        <defs>
          <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
            {pattern === "dots" && (
              <circle cx="4" cy="4" r="1.2" fill="white" opacity="0.5" />
            )}
            {pattern === "stripes" && (
              <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1" opacity="0.3" />
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
