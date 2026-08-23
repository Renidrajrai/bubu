// Bobbing emoji sticker scattered through the flow (reference design).
export default function Sticker({
  emoji,
  className = "",
}: {
  emoji: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={`flex justify-center py-2 ${className}`}>
      <span className="sticker-bob text-4xl drop-shadow-[0_6px_10px_rgba(84,55,43,0.18)]">
        {emoji}
      </span>
    </div>
  );
}
