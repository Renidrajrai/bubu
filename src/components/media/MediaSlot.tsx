import Image from "next/image";

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
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 30vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg viewBox="0 0 40 60" className="h-12 w-8 opacity-25">
            <ellipse cx="20" cy="16" rx="6" ry="8" fill="var(--blush-2)" />
            <path d="M20 24 C 20 36, 20 44, 20 58" stroke="var(--cocoa-soft)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
}
