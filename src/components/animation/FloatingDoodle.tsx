// Tiny hand-drawn accents (spec §33/81). Decorative only — always aria-hidden.
const doodles = {
  sparkle: (
    <path
      d="M12 3v18M4 12h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  star: (
    <path
      d="M12 2.5 14.6 9l7 .6-5.3 4.6 1.6 6.9L12 17.4 6.1 21l1.6-6.8L2.4 9.6l7-.6L12 2.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  scribble: (
    <path
      d="M20.5 12a8.5 8.5 0 1 0-17 .5c.2 4.4 3.8 7.6 8 7.4 3.8-.2 6.6-3.3 6.4-7-.2-3.2-2.9-5.6-6-5.4-2.7.2-4.7 2.4-4.5 5 .2 2.2 2 3.8 4.2 3.7 1.8-.1 3-1.6 2.9-3.3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  "arrow-down": (
    <path
      d="M6 4c10 3 13 9 12.5 15m0 0-4.2-4.4m4.2 4.4 4-4.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M12 20.5C5.5 15 3.5 10.8 6.2 7.9c1.9-2 4.3-1.2 5.8 1 .1.2.4.2.5 0 1.5-2.2 3.9-3 5.8-1 2.7 2.9.7 7.1-6.3 12.6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
} as const;

export type DoodleKind = keyof typeof doodles;

export default function FloatingDoodle({
  kind,
  className = "",
}: {
  kind: DoodleKind;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {doodles[kind]}
    </svg>
  );
}
