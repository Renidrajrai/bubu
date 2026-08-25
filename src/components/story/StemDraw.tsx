"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

// §98: Scroll-linked stem drawing via pathLength.
// Draws from bottom (stem base) to top (flower head).

export default function StemDraw({
  progress,
  d = "M50 95 C 48 75, 52 55, 50 35",
  stroke = "var(--cocoa-soft)",
  strokeWidth = 2.5,
  range = [0, 0.35],
  className = "",
}: {
  progress: MotionValue<number>;
  d?: string;
  stroke?: string;
  strokeWidth?: number;
  range?: [number, number];
  className?: string;
}) {
  const pathLength = useTransform(progress, range, [0, 1]);
  const opacity = useTransform(progress, [range[0], range[0] + 0.03], [0, 1]);

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      className={className}
      style={{ pathLength, opacity }}
    />
  );
}
