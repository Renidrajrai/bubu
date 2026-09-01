// Botanical dandelion seed — teardrop body + thin beak + pappus crown.
// ponytail: single SVG, no runtime math beyond the seed shape.
export default function Seed({
  size = 24,
  bodyColor = "var(--cocoa-soft)",
  pappusColor = "var(--cloud)",
  filaments = 5,
  className = "",
  style,
}: {
  size?: number;
  bodyColor?: string;
  pappusColor?: string;
  filaments?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // pappus fan angles: spread from -30° to +30° around vertical
  const spread = 60;
  const lines = Array.from({ length: filaments }, (_, i) => {
    const angle = -spread / 2 + (i / (filaments - 1 || 1)) * spread;
    const rad = (angle * Math.PI) / 180;
    const len = 5 + (i % 2) * 1.5;
    return {
      x2: Math.sin(rad) * len,
      y2: -Math.cos(rad) * len,
      opacity: 0.6 + (i % 2) * 0.2,
    };
  });

  return (
    <svg
      viewBox="0 0 24 30"
      aria-hidden
      className={className}
      style={{ width: size, height: size * 1.25, ...style }}
    >
      {/* pappus crown at top */}
      <g transform="translate(12, 8)">
        {lines.map((l, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={l.x2}
            y2={l.y2}
            stroke={pappusColor}
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity={l.opacity}
          />
        ))}
      </g>

      {/* beak / stalk */}
      <line
        x1="12" y1="8" x2="12" y2="13"
        stroke={bodyColor}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* seed body — teardrop */}
      <path
        d="M12 24 C12 24, 8.5 20, 8.5 16.5 C8.5 14, 10 12.5, 12 12 C14 12.5, 15.5 14, 15.5 16.5 C15.5 20, 12 24, 12 24Z"
        fill={bodyColor}
        opacity="0.85"
      />

      {/* subtle highlight on seed body */}
      <path
        d="M12 22 C12 22, 10 19, 10 17 C10 15.5, 11 14.5, 12 14"
        stroke="var(--cream)"
        strokeWidth="0.4"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
