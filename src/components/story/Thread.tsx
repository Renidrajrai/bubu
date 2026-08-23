"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

// Dashed thread that draws itself downward with scene progress —
// the connective tissue between story beats (spec §22/23).
export default function Thread({
  progress,
  d,
  range = [0.6, 1],
  className = "",
}: {
  progress: MotionValue<number>;
  d: string;
  range?: [number, number];
  className?: string;
}) {
  const pathLength = useTransform(progress, range, [0, 1]);
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <motion.path
        d={d}
        stroke="var(--caramel)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="0.6 2.4"
        style={{ pathLength, opacity: 0.65 }}
      />
    </svg>
  );
}
