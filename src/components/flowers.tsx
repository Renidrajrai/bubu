// Shared SVG flora for the bloom → dandelion → regrowth story.
// Flat cute fills matching the bubu & dudu palette.

export function FlowerHead({ className = "" }: { className?: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="-60 -60 120 120" aria-hidden className={className}>
      {petals.map((deg) => (
        <path
          key={deg}
          d="M0 -10 C -13 -26, -13 -48, 0 -58 C 13 -48, 13 -26, 0 -10 Z"
          fill="var(--blush-2)"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="9" fill="var(--gold)" />
      <circle r="4" fill="var(--caramel)" />
    </svg>
  );
}

export function DandelionHead({ className = "" }: { className?: string }) {
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="-44 -44 88 88" aria-hidden className={className}>
      {spokes.map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <line y2="-30" stroke="var(--cocoa-soft)" strokeWidth="1.6" opacity=".55" />
          <circle cy="-34" r="3.4" fill="var(--cloud)" stroke="var(--cocoa-soft)" strokeWidth=".8" opacity=".9" />
        </g>
      ))}
      <circle r="7" fill="var(--cocoa-soft)" />
    </svg>
  );
}

export function Seed({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <line x1="12" y1="14" x2="12" y2="4" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="8" x2="6" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="8" x2="18" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="12" cy="17.5" rx="2.6" ry="4.5" fill="var(--cocoa-soft)" />
    </svg>
  );
}

export function Sprout({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 80" aria-hidden className={className} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path
        d="M30 78 C 30 58, 30 46, 30 34"
        stroke="var(--cocoa-soft)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M30 40 C 16 38, 10 28, 12 20 C 24 22, 29 30, 30 40 Z" fill="var(--sage)" />
      <path d="M30 48 C 44 45, 50 36, 48 27 C 36 30, 31 38, 30 48 Z" fill="var(--blush-2)" />
    </svg>
  );
}

// A single petal used for the falling beat.
export function Petal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-16 -62 32 66" aria-hidden className={className}>
      <path
        d="M0 -10 C -13 -26, -13 -48, 0 -58 C 13 -48, 13 -26, 0 -10 Z"
        fill="var(--blush-2)"
      />
    </svg>
  );
}
