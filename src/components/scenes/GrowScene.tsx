"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import GerminationSequence, { type GerminationConfig } from "../story/GerminationSequence";
import SceneShell from "../story/SceneShell";
import SceneCamera from "../story/SceneCamera";
import { CAMERA_PRESETS } from "@/config/animation";
import type { PublicSlot } from "@/lib/story-data";

function buildPlants(slots: PublicSlot[]): GerminationConfig[] {
  const defaults: Array<{ position: { left: string; bottom: string }; seedRange: [number, number]; stemRange: [number, number]; budRange: [number, number]; bloomRange: [number, number]; memoryRange: [number, number] }> = [
    {
      position: { left: "24%", bottom: "16%" },
      seedRange: [0.08, 0.18],
      stemRange: [0.15, 0.32],
      budRange: [0.28, 0.36],
      bloomRange: [0.34, 0.44],
      memoryRange: [0.4, 0.5],
    },
    {
      position: { left: "50%", bottom: "16%" },
      seedRange: [0.2, 0.3],
      stemRange: [0.28, 0.45],
      budRange: [0.42, 0.5],
      bloomRange: [0.48, 0.58],
      memoryRange: [0.54, 0.64],
    },
    {
      position: { left: "75%", bottom: "16%" },
      seedRange: [0.32, 0.42],
      stemRange: [0.4, 0.57],
      budRange: [0.54, 0.62],
      bloomRange: [0.6, 0.7],
      memoryRange: [0.66, 0.76],
    },
  ];

  return defaults.map((d, i) => {
    const mem = slots[i]?.memory;
    return {
      ...d,
      memory: mem
        ? { src: mem.mediaUrl, alt: mem.title || `flower ${i + 1}`, caption: mem.caption }
        : undefined,
    };
  });
}

function Content({ p, slots }: { p: MotionValue<number>; slots: PublicSlot[] }) {
  const plants = buildPlants(slots);
  const groundLength = useTransform(p, [0.02, 0.12], [0, 1]);
  const groundOpacity = useTransform(p, [0.02, 0.06], [0, 0.4]);
  const captionOpacity = useTransform(p, [0.82, 0.9], [0, 1]);

  return (
    <SceneCamera progress={p} config={CAMERA_PRESETS.grow}>
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

      {plants.map((config, i) => {
        // Depth layers: foreground (larger), midground (standard), background (smaller, faded)
        const depthStyles = [
          { transform: "scale(1.15)", zIndex: 3 },
          { transform: "scale(1)", zIndex: 2 },
          { transform: "scale(0.85)", zIndex: 1, opacity: 0.7 },
        ][i] ?? {};
        return (
          <div key={i} style={depthStyles} className="absolute inset-0">
            <GerminationSequence progress={p} config={config} />
          </div>
        );
      })}

      <motion.p
        className="absolute top-[14%] font-hand text-3xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        and every seed starts again.
      </motion.p>
    </SceneCamera>
  );
}

export default function GrowScene({ slots }: { slots: PublicSlot[] }) {
  return (
    <SceneShell vh={320}>
      {(p) => <Content p={p} slots={slots} />}
    </SceneShell>
  );
}
