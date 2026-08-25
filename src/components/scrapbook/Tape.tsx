// Tape strip — positioned absolutely on a card corner.
export default function Tape({
  rotation = -3,
  color = "var(--blush)",
  className = "",
}: {
  rotation?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute -top-2.5 left-1/2 h-[22px] w-16 -translate-x-1/2 rounded-[2px] border border-white/50 shadow-sm ${className}`}
      style={{
        rotate: `${rotation}deg`,
        backgroundColor: `${color}bf`,
      }}
    />
  );
}
