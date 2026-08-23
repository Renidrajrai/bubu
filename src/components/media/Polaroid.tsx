import MediaSlot from "./MediaSlot";

// White polaroid frame from the reference design: tape, Caveat caption, date stamp.
export default function Polaroid({
  src,
  alt = "",
  aspectRatio,
  caption,
  stamp,
  tape = false,
  className = "",
}: {
  src: string;
  alt?: string;
  aspectRatio: string;
  caption?: string;
  stamp?: string;
  tape?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`rounded-md bg-cloud p-2.5 pb-3 shadow-soft transition-all duration-300 [transition-timing-function:var(--ease-pop)] hover:-translate-y-1 hover:scale-[1.04] hover:shadow-lift ${className}`}
    >
      <div className="relative">
        <MediaSlot aspectRatio={aspectRatio} src={src} alt={alt} className="rounded-sm" />
        {tape && (
          <div
            aria-hidden
            className="absolute -top-2.5 left-1/2 h-[22px] w-16 -translate-x-1/2 rotate-[-3deg] rounded-[2px] border border-white/50 bg-blush/75 shadow-sm"
          />
        )}
      </div>
      {(caption || stamp) && (
        <figcaption className="mt-2 text-center">
          {caption && <p className="font-hand text-xl leading-tight text-cocoa">{caption}</p>}
          {stamp && (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa-soft/70">
              {stamp}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
