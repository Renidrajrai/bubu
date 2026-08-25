const variants = {
  leaf: (
    <svg viewBox="0 0 24 32" fill="none" className="h-full w-full">
      <path
        d="M12 30 C 12 22, 12 16, 12 8"
        stroke="var(--cocoa-soft)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 8 C 8 4, 4 6, 6 12 C 8 16, 12 14, 12 8 Z"
        fill="var(--blush-2)"
        opacity="0.7"
      />
      <path
        d="M12 8 C 16 4, 20 6, 18 12 C 16 16, 12 14, 12 8 Z"
        fill="var(--blush-2)"
        opacity="0.5"
      />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6"
          rx="3"
          ry="5"
          fill="var(--blush-2)"
          opacity="0.6"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.5" fill="var(--gold)" opacity="0.7" />
    </svg>
  ),
  tape: (
    <svg viewBox="0 0 40 12" className="h-full w-full">
      <rect
        x="1"
        y="1"
        width="38"
        height="10"
        rx="1"
        fill="var(--blush)"
        opacity="0.6"
        stroke="var(--blush-2)"
        strokeWidth="0.5"
      />
      <line x1="5" y1="4" x2="35" y2="4" stroke="var(--blush-2)" strokeWidth="0.4" opacity="0.4" />
      <line x1="5" y1="8" x2="35" y2="8" stroke="var(--blush-2)" strokeWidth="0.4" opacity="0.3" />
    </svg>
  ),
  bud: (
    <svg viewBox="0 0 16 24" fill="none" className="h-full w-full">
      <path
        d="M8 22 C 8 16, 8 12, 8 8"
        stroke="var(--cocoa-soft)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="8" cy="6" rx="3" ry="5" fill="var(--blush-2)" opacity="0.5" />
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 32 24" fill="none" className="h-full w-full">
      <path
        d="M2 20 C 10 16, 18 12, 30 4"
        stroke="var(--cocoa-soft)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="14" cy="13" r="2" fill="var(--blush-2)" opacity="0.4" />
      <circle cx="22" cy="8" r="1.5" fill="var(--blush-2)" opacity="0.3" />
    </svg>
  ),
} as const;

export type BotanicalVariant = keyof typeof variants;

export default function BotanicalSticker({
  variant = "leaf",
  className = "",
  style,
}: {
  variant?: BotanicalVariant;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`sticker-bob ${className}`}
      style={{ width: 28, height: 28, ...style }}
    >
      {variants[variant]}
    </div>
  );
}
