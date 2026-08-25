import Polaroid from "../media/Polaroid";
import type { PaperVariant } from "@/types/story";
import { PAPER_VARIANTS } from "@/config/animation";
import Tape from "./Tape";
import WashiTape from "./WashiTape";
import Stamp from "./Stamp";

// §85, §117: The main photo display component in scrapbook style.
// Wraps Polaroid with paper texture, tape, stamps, and annotations.
export default function PaperCard({
  src,
  alt = "",
  aspectRatio = "3/4",
  caption,
  date,
  location,
  category,
  annotation,
  paperVariant = "standard",
  showTape = false,
  className = "",
}: {
  src: string;
  alt?: string;
  aspectRatio?: string;
  caption?: string;
  date?: string;
  location?: string;
  category?: string;
  annotation?: string;
  paperVariant?: PaperVariant;
  showTape?: boolean;
  className?: string;
}) {
  const variant = PAPER_VARIANTS[paperVariant];

  return (
    <figure
      className={`relative ${className}`}
      style={{
        transform: `rotate(${variant.rotation}deg) skewX(${variant.tilt}deg)`,
        filter: variant.blur > 0 ? `blur(${variant.blur}px)` : undefined,
      }}
    >
      {showTape && <Tape rotation={variant.rotation * 2} />}
      {showTape && <WashiTape width={60} className="absolute -bottom-2 right-2 rotate-6" />}

      <Polaroid
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        caption={caption}
      />

      {(date || location || category) && (
        <figcaption className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {date && <Stamp text={date} variant="date" />}
          {location && <Stamp text={location} variant="location" />}
          {category && <Stamp text={category} variant="category" />}
        </figcaption>
      )}

      {annotation && (
        <p className="mt-1 font-hand text-sm text-cocoa-soft italic">
          {annotation}
        </p>
      )}
    </figure>
  );
}
