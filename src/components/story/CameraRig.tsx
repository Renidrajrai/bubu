"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { CAMERA_PRESETS } from "@/config/animation";

// §95–§97: Camera follows scroll — scale + translateY interpolation.
// Per-scene presets from animation config. Spring smoothing.

export default function CameraRig({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();

  // Map global scroll to camera transforms
  // 5 scenes, each gets ~20% of scroll range
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      CAMERA_PRESETS.intro.startScale,
      CAMERA_PRESETS.bloom.startScale,
      CAMERA_PRESETS.dandelion.startScale,
      CAMERA_PRESETS.grow.startScale,
      CAMERA_PRESETS.ending.startScale,
      CAMERA_PRESETS.ending.endScale,
    ],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      CAMERA_PRESETS.intro.startY,
      CAMERA_PRESETS.bloom.startY,
      CAMERA_PRESETS.dandelion.startY,
      CAMERA_PRESETS.grow.startY,
      CAMERA_PRESETS.ending.startY,
      CAMERA_PRESETS.ending.endY,
    ],
  );

  return (
    <motion.div
      className="w-full"
      style={{ scale, y }}
    >
      {children}
    </motion.div>
  );
}
