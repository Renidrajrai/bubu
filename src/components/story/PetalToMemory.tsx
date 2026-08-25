"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import PaperCard from "../scrapbook/PaperCard";
import { Petal } from "@/assets/flowers";
import { MEMORY_TIMING } from "@/config/animation";
import type { MemoryReveal } from "@/types/story";

// §84–§86: Petal detaches from flower → floats down → morphs into PaperCard.
// Each `memoryReveal` variant changes the transition style.

export default function PetalToMemory({
  progress,
  range,
  src,
  alt = "",
  caption,
  date,
  location,
  category,
  variant = "dissolve",
  petalColor = "var(--blush-2)",
  className = "",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  src: string;
  alt?: string;
  caption?: string;
  date?: string;
  location?: string;
  category?: string;
  variant?: MemoryReveal;
  petalColor?: string;
  className?: string;
}) {
  const t = MEMORY_TIMING;
  const [start, end] = range;
  const span = end - start;

  // Phase 1: petal detach + drift
  const detachEnd = start + span * t.petalDetach;
  const petalY = useTransform(progress, [start, detachEnd], [0, 60]);
  const petalX = useTransform(progress, [start, detachEnd], [0, -8]);
  const petalRotate = useTransform(progress, [start, detachEnd], [0, 15]);
  const petalOpacity = useTransform(progress, [start, detachEnd * 0.5, detachEnd], [1, 0.8, 0]);

  // Phase 2: card reveal
  const revealStart = detachEnd;
  const revealEnd = revealStart + span * t.reveal;

  const cardVariants: Record<MemoryReveal, { scale: MotionValue; blur: MotionValue; y: MotionValue }> = {
    dissolve: {
      scale: useTransform(progress, [revealStart, revealEnd], [0.9, 1]),
      blur: useTransform(progress, [revealStart, revealEnd], [4, 0]),
      y: useTransform(progress, [revealStart, revealEnd], [20, 0]),
    },
    slide: {
      scale: useTransform(progress, [revealStart, revealEnd], [0.95, 1]),
      blur: useTransform(progress, [revealStart, revealEnd], [2, 0]),
      y: useTransform(progress, [revealStart, revealEnd], [40, 0]),
    },
    scale: {
      scale: useTransform(progress, [revealStart, revealEnd], [0.5, 1]),
      blur: useTransform(progress, [revealStart, revealEnd], [6, 0]),
      y: useTransform(progress, [revealStart, revealEnd], [10, 0]),
    },
    gentleBlur: {
      scale: useTransform(progress, [revealStart, revealEnd], [0.92, 1]),
      blur: useTransform(progress, [revealStart, revealEnd], [8, 0]),
      y: useTransform(progress, [revealStart, revealEnd], [15, 0]),
    },
  };

  const v = cardVariants[variant];
  const cardOpacity = useTransform(progress, [revealStart, revealStart + 0.04], [0, 1]);

  // Phase 3: settle
  const settleEnd = revealEnd + span * t.settle;

  return (
    <div aria-hidden className={`relative ${className}`}>
      {/* Petal drifting down */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ y: petalY, x: petalX, rotate: petalRotate, opacity: petalOpacity }}
      >
        <Petal size={28} color={petalColor} />
      </motion.div>

      {/* Card appearing */}
      <motion.div
        style={{
          opacity: cardOpacity,
          scale: v.scale,
          y: v.y,
          filter: useTransform(v.blur, (b) => `blur(${b}px)`),
        }}
      >
        <PaperCard
          src={src}
          alt={alt}
          caption={caption}
          date={date}
          location={location}
          category={category}
          paperVariant="scrapbook"
          showTape
        />
      </motion.div>
    </div>
  );
}
