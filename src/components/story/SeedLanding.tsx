"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";

// §113: Seed drifts down and lands with a gentle bounce.
// Pause at rest, then stem begins to emerge.

export default function SeedLanding({
  progress,
  range,
  className = "",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const [start, end] = range;
  const span = end - start;

  // Drift down
  const driftEnd = start + span * 0.5;
  const y = useTransform(progress, [start, driftEnd], [-30, 0]);
  const x = useTransform(progress, [start, driftEnd], [0, 3]);
  const rotate = useTransform(progress, [start, driftEnd], [-15, 5]);
  const opacity = useTransform(progress, [start, start + 0.04], [0, 1]);

  // Gentle bounce on landing
  const bounceRaw = useTransform(progress, [driftEnd, driftEnd + span * 0.15], [0, -6]);
  const bounce = useSpring(bounceRaw, { stiffness: 300, damping: 10 });

  // Rest + fade
  const restY = useTransform(progress, [driftEnd + span * 0.15, end], [0, 2]);
  const restOpacity = useTransform(progress, [end - span * 0.1, end], [1, 0.6]);

  const combinedY = useTransform([y, bounce, restY], ([yv, bv, rv]: number[]) => yv + bv + rv);
  const combinedOpacity = useTransform([opacity, restOpacity], ([o, ro]: number[]) => Math.min(o, ro));

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ y: combinedY, x, rotate, opacity: combinedOpacity }}
    >
      {/* Seed SVG */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <line x1="12" y1="14" x2="12" y2="4" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="8" x2="6" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="8" x2="18" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="12" cy="17.5" rx="2.6" ry="4.5" fill="var(--cocoa-soft)" />
      </svg>
    </motion.div>
  );
}
