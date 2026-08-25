"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";
import StemDraw from "./StemDraw";
import { Leaf, Bud, FlowerCenter } from "@/assets/flowers";
import { FLOWER_TIMING } from "@/config/animation";

// §99–§101: Orchestrates the full flower growth sequence.
// Stem → leaves → bud → petals → center, each mapped to scroll fractions.
// Petals are rendered via render prop so scenes can customize them.

export default function GrowthSequence({
  progress,
  stemPath = "M50 95 C 48 70, 52 50, 50 30",
  stemRange,
  leafPositions = [
    { y: 65, side: "left", size: 18, rotation: -30 },
    { y: 55, side: "right", size: 16, rotation: 30 },
  ],
  budPosition = { y: 28 },
  petals,
  centerSize = 14,
  stemStroke = "var(--cocoa-soft)",
  stemWidth = 2.5,
  className = "",
}: {
  progress: MotionValue<number>;
  stemPath?: string;
  stemRange?: [number, number];
  leafPositions?: Array<{ y: number; side: "left" | "right"; size: number; rotation: number }>;
  budPosition?: { y: number };
  petals?: (props: { progress: MotionValue<number> }) => React.ReactNode;
  centerSize?: number;
  stemStroke?: string;
  stemWidth?: number;
  className?: string;
}) {
  const t = FLOWER_TIMING;

  // Derive ranges from timing
  const stemEnd = t.stem;
  const leafStart = t.stem * 0.6;
  const leafEnd = leafStart + t.leaves;
  const budStart = leafEnd * 0.8;
  const budEnd = budStart + t.bud;
  const petalStart = budEnd * 0.85;
  const petalEnd = petalStart + t.petals;
  const centerStart = petalEnd * 0.8;
  const centerEnd = centerStart + t.center;

  const sRange = stemRange ?? [0, stemEnd];

  // Bud scale: swell from 0 → 1 with spring
  const budRaw = useTransform(progress, [budStart, budEnd], [0, 1]);
  const budScale = useSpring(budRaw, { stiffness: 120, damping: 14 });
  const budOpacity = useTransform(progress, [budStart, budStart + 0.04], [0, 1]);

  // Center appearance
  const centerScale = useTransform(progress, [centerStart, centerEnd], [0, 1]);
  const centerOpacity = useTransform(progress, [centerStart, centerStart + 0.03], [0, 1]);

  return (
    <div aria-hidden className={`relative ${className}`}>
      {/* Stem */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <StemDraw
          progress={progress}
          d={stemPath}
          stroke={stemStroke}
          strokeWidth={stemWidth}
          range={sRange}
        />
      </svg>

      {/* Leaves */}
      {leafPositions.map((leaf, i) => {
        const leafDelay = leafStart + (i / leafPositions.length) * t.leaves * 0.4;
        const leafScale = useTransform(progress, [leafDelay, leafDelay + 0.12], [0, 1]);
        const leafOpacity = useTransform(progress, [leafDelay, leafDelay + 0.06], [0, 0.9]);
        const x = leaf.side === "left" ? -12 : 12;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${leaf.y}%`,
              left: `calc(50% + ${x}px)`,
              transform: "translate(-50%, -50%)",
              scale: leafScale,
              opacity: leafOpacity,
            }}
          >
            <Leaf size={leaf.size} rotation={leaf.rotation} />
          </motion.div>
        );
      })}

      {/* Bud */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: `${budPosition.y}%`,
          scale: budScale,
          opacity: budOpacity,
        }}
      >
        <Bud size={20} />
      </motion.div>

      {/* Petals (render prop for scene customization) */}
      {petals && (
        <motion.div
          className="absolute left-1/2 top-[24%] -translate-x-1/2"
          style={{
            opacity: useTransform(progress, [petalStart, petalStart + 0.05], [0, 1]),
          }}
        >
          {petals({ progress })}
        </motion.div>
      )}

      {/* Center */}
      <motion.div
        className="absolute left-1/2 top-[26%] -translate-x-1/2"
        style={{
          scale: centerScale,
          opacity: centerOpacity,
        }}
      >
        <FlowerCenter size={centerSize} />
      </motion.div>
    </div>
  );
}
