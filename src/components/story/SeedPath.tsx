"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { SEED_PATHS } from "@/config/animation";
import type { SeedPathType } from "@/types/story";

// §104–§107: Animated seed along an SVG path.
// Uses pathOffset to move a Seed along a pre-defined trajectory.

export default function SeedPath({
  progress,
  range,
  pathType = "straight",
  seedComponent: SeedComponent,
  className = "",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  pathType?: SeedPathType;
  seedComponent?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const d = SEED_PATHS[pathType];
  const pathProgress = useTransform(progress, range, [0, 1]);
  const opacity = useTransform(
    pathProgress,
    [0, 0.05, 0.85, 1],
    [0, 1, 1, 0],
  );

  return (
    <div className={`relative ${className}`}>
      {/* SVG path (invisible, used for motion path) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.path
          d={d}
          fill="none"
          stroke="transparent"
          style={{ pathLength: pathProgress }}
        />
      </svg>

      {/* Seed component riding the path */}
      <motion.div
        className="absolute"
        style={{
          left: `${useTransform(pathProgress, (p) => {
            // Simple parametric: parse path direction for position
            if (pathType === "straight") return "50%";
            if (pathType === "curveLeft") return `${50 - p * 25}%`;
            if (pathType === "curveRight") return `${50 + p * 25}%`;
            return `${50 + Math.sin(p * Math.PI * 2) * 10}%`;
          })}%`,
          top: `${useTransform(pathProgress, (p) => `${30 + p * 55}%`)}%`,
          opacity,
        }}
      >
        {SeedComponent ? (
          <SeedComponent className="h-6 w-6" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <line x1="12" y1="14" x2="12" y2="4" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="12" y1="8" x2="6" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="12" y1="8" x2="18" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
            <ellipse cx="12" cy="17.5" rx="2.6" ry="4.5" fill="var(--cocoa-soft)" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
