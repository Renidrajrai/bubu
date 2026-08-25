"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { WIND_CONFIGS } from "@/config/animation";
import type { WindPreset } from "@/types/story";

// §103, §110: Dandelion head bends in wind direction.
// Pappus strands drift. Visual wind lines appear.

export default function WindEffect({
  progress,
  range,
  preset = "medium",
  headRotate,
  className = "",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  preset?: WindPreset;
  headRotate: MotionValue<number>;
  className?: string;
}) {
  const config = WIND_CONFIGS[preset];
  const [start, end] = range;
  const mid = (start + end) / 2;

  // Wind lines opacity
  const gustA = useTransform(progress, [start, mid, end], [0, 1, 0]);
  const gustB = useTransform(progress, [start + 0.05, mid + 0.05, end], [0, 0.8, 0]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {/* Wind gust arc A */}
      <motion.path
        d="M8 34 C 26 30, 40 36, 56 31 S 78 28, 88 33"
        stroke="var(--caramel)"
        strokeWidth={0.8}
        strokeLinecap="round"
        style={{ pathLength: gustA, opacity: gustA }}
      />
      {/* Wind gust arc B */}
      <motion.path
        d="M12 44 C 30 41, 44 47, 60 42 S 80 40, 90 44"
        stroke="var(--caramel)"
        strokeWidth={0.7}
        strokeLinecap="round"
        style={{ pathLength: gustB, opacity: gustB }}
      />
    </svg>
  );
}
