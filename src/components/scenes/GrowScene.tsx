"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import GerminationSequence, { type GerminationConfig } from "../story/GerminationSequence";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";

// Beat 3 — seeds land, germinate into flowers holding photos.

export default function GrowScene() {
  return <SceneShell vh={320}>{(p) => <Content p={p} />}</SceneShell>;
}

const PLANTS: GerminationConfig[] = [
  {
    position: { left: "24%", bottom: "16%" },
    seedRange: [0.08, 0.18],
    stemRange: [0.15, 0.32],
    budRange: [0.28, 0.36],
    bloomRange: [0.34, 0.44],
    memory: { src: ph("pattu-04", 600, 750), alt: "road trip", caption: "road trip, day one" },
    memoryRange: [0.4, 0.5],
  },
  {
    position: { left: "50%", bottom: "16%" },
    seedRange: [0.2, 0.3],
    stemRange: [0.28, 0.45],
    budRange: [0.42, 0.5],
    bloomRange: [0.48, 0.58],
    memory: { src: ph("pattu-07", 600, 750), alt: "soft light", caption: "soft morning light" },
    memoryRange: [0.54, 0.64],
  },
  {
    position: { left: "75%", bottom: "16%" },
    seedRange: [0.32, 0.42],
    stemRange: [0.4, 0.57],
    budRange: [0.54, 0.62],
    bloomRange: [0.6, 0.7],
    memory: { src: ph("pattu-08", 600, 750), alt: "golden hour", caption: "golden hour, always" },
    memoryRange: [0.66, 0.76],
  },
];

function Content({ p }: { p: MotionValue<number> }) {
  const groundLength = useTransform(p, [0.02, 0.12], [0, 1]);
  const groundOpacity = useTransform(p, [0.02, 0.06], [0, 0.4]);
  const captionOpacity = useTransform(p, [0.82, 0.9], [0, 1]);

  return (
    <>
      {/* Ground line */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.line
          x1="10" y1="84" x2="90" y2="84"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.6}
          strokeLinecap="round"
          style={{ pathLength: groundLength, opacity: groundOpacity }}
        />
      </svg>

      {/* Germinating plants */}
      {PLANTS.map((config, i) => (
        <GerminationSequence key={i} progress={p} config={config} />
      ))}

      <motion.p
        className="absolute top-[14%] font-hand text-3xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        and every seed starts again.
      </motion.p>
    </>
  );
}
