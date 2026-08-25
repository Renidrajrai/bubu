"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";

// §82–§83: Paper card gentle hover/floating while in viewport.
// Subtle vertical oscillation + slight rotation drift.
// Reduced motion: keeps opacity only, no transforms.

export default function MemoryFloat({
  progress,
  range = [0.1, 0.9],
  children,
  className = "",
}: {
  progress: MotionValue<number>;
  range?: [number, number];
  children: React.ReactNode;
  className?: string;
}) {
  const [start, end] = range;

  // Gentle vertical bob — sinusoidal mapped from progress
  const bobRaw = useTransform(
    progress,
    [start, (start + end) / 2, end],
    [0, 6, 0],
  );
  const bob = useSpring(bobRaw, { stiffness: 30, damping: 12 });

  // Slight rotation drift
  const rotRaw = useTransform(
    progress,
    [start, (start + end) / 2, end],
    [-0.5, 0.5, -0.5],
  );
  const rot = useSpring(rotRaw, { stiffness: 25, damping: 10 });

  return (
    <motion.div
      className={className}
      style={{ y: bob, rotate: rot }}
    >
      {children}
    </motion.div>
  );
}
