"use client";

import { motion, useScroll, useTransform } from "motion/react";

// §36, §105: Persistent garden layer behind all scenes.
// Phase 7 will populate with botanical SVG elements.
// Phase 1 — just the scroll-linked background color interpolation.

export default function BackgroundMood() {
  const { scrollYProgress } = useScroll();

  // §105: mood palette interpolation — cream → blush → cream → sage-tint → cream
  const bg = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "var(--cream)",
      "var(--blush)",
      "var(--cream)",
      "var(--sage-tint, var(--cream))",
      "var(--cream)",
    ],
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: bg }}
    />
  );
}
