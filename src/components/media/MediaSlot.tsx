import Image from "next/image";

// Stable media container: honors the slot's aspect-ratio so layout never shifts
// when real memories arrive (Phase 8 swaps this for a SmartImage wrapper).
export default function MediaSlot({
  aspectRatio,
  src,
  alt = "",
  className = "",
}: {
  aspectRatio: string;
  src?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-muted ${className}`}
      style={{ aspectRatio }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );
}
