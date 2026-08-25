"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import SeedLanding from "./SeedLanding";
import { Leaf, Bud, FlowerCenter } from "@/assets/flowers";
import StemDraw from "./StemDraw";
import PaperCard from "../scrapbook/PaperCard";
import { FLOWER_TIMING } from "@/config/animation";

// §114–§116: Seed lands → stem emerges → bud → bloom → memory card.
// Combines SeedLanding + growth stages.

export type GerminationConfig = {
  position: { left: string; bottom: string };
  seedRange: [number, number];
  stemPath?: string;
  stemRange: [number, number];
  leafPositions?: Array<{ y: number; side: "left" | "right"; size: number; rotation: number }>;
  budRange: [number, number];
  bloomRange: [number, number];
  memory?: { src: string; alt: string; caption?: string; aspectRatio?: string };
  memoryRange: [number, number];
};

export default function GerminationSequence({
  progress,
  config,
  className = "",
}: {
  progress: MotionValue<number>;
  config: GerminationConfig;
  className?: string;
}) {
  const t = FLOWER_TIMING;

  // Stem draw
  const stemLength = useTransform(progress, config.stemRange, [0, 1]);
  const stemOpacity = useTransform(progress, [config.stemRange[0], config.stemRange[0] + 0.04], [0, 1]);

  // Leaves
  const leaves = config.leafPositions ?? [
    { y: 65, side: "left" as const, size: 16, rotation: -30 },
    { y: 55, side: "right" as const, size: 14, rotation: 30 },
  ];

  // Bud
  const budScale = useTransform(progress, config.budRange, [0, 1]);
  const budOpacity = useTransform(progress, [config.budRange[0], config.budRange[0] + 0.04], [0, 1]);

  // Bloom
  const bloomScale = useTransform(progress, config.bloomRange, [0, 1]);
  const bloomOpacity = useTransform(progress, [config.bloomRange[0], config.bloomRange[0] + 0.05], [0, 1]);

  // Center
  const centerStart = config.bloomRange[0] + 0.08;
  const centerScale = useTransform(progress, [centerStart, centerStart + 0.08], [0, 1]);

  // Memory
  const memOpacity = config.memory
    ? useTransform(progress, config.memoryRange, [0, 1])
    : undefined;
  const memY = config.memory
    ? useTransform(progress, config.memoryRange, [20, 0])
    : undefined;

  return (
    <div
      aria-hidden
      className={`absolute ${className}`}
      style={{ left: config.position.left, bottom: config.position.bottom }}
    >
      {/* Seed landing */}
      <SeedLanding progress={progress} range={config.seedRange} className="absolute -top-8 left-1/2 -translate-x-1/2" />

      {/* Stem */}
      <svg
        viewBox="0 0 60 80"
        className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-16 -translate-x-1/2"
      >
        <StemDraw
          progress={progress}
          d={config.stemPath ?? "M30 78 C 30 60, 30 48, 30 28"}
          strokeWidth={2}
          range={config.stemRange}
        />
      </svg>

      {/* Leaves */}
      {leaves.map((leaf, i) => {
        const leafDelay = config.stemRange[0] + (i / leaves.length) * (config.stemRange[1] - config.stemRange[0]) * 0.5;
        const leafScale = useTransform(progress, [leafDelay, leafDelay + 0.1], [0, 1]);
        const x = leaf.side === "left" ? -10 : 10;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              bottom: `${leaf.y}%`,
              left: `calc(50% + ${x}px)`,
              scale: leafScale,
            }}
          >
            <Leaf size={leaf.size} rotation={leaf.rotation} />
          </motion.div>
        );
      })}

      {/* Bud */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "70%", scale: budScale, opacity: budOpacity }}
      >
        <Bud size={16} />
      </motion.div>

      {/* Bloom */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "68%", scale: bloomScale, opacity: bloomOpacity }}
      >
        <svg viewBox="-30 -30 60 60" className="h-16 w-16 sm:h-20 sm:w-20">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0 -6 C -8 -16, -8 -28, 0 -34 C 8 -28, 8 -16, 0 -6 Z"
              fill="var(--blush-2)"
              transform={`rotate(${deg})`}
            />
          ))}
          <motion.g style={{ scale: centerScale }}>
            <FlowerCenter size={8} />
          </motion.g>
        </svg>
      </motion.div>

      {/* Memory card */}
      {config.memory && memOpacity && memY && (
        <motion.div
          className="absolute left-1/2 w-32 -translate-x-1/2 sm:w-40"
          style={{ bottom: "80%", opacity: memOpacity, y: memY }}
        >
          <PaperCard
            src={config.memory.src}
            alt={config.memory.alt}
            caption={config.memory.caption}
            aspectRatio={config.memory.aspectRatio ?? "3/4"}
            paperVariant="scrapbook"
            showTape
          />
        </motion.div>
      )}
    </div>
  );
}
