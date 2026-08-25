"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { CameraPreset } from "@/types/story";

export default function SceneCamera({
  progress,
  config,
  children,
}: {
  progress: MotionValue<number>;
  config: CameraPreset;
  children: React.ReactNode;
}) {
  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [config.startScale, (config.startScale + config.endScale) / 2, config.endScale],
  );
  const y = useTransform(
    progress,
    [0, 1],
    [config.startY, config.endY],
  );

  return (
    <motion.div className="h-full w-full" style={{ scale, y }}>
      {children}
    </motion.div>
  );
}
