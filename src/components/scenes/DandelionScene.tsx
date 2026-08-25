"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { DandelionHead } from "@/assets/flowers";
import StemDraw from "../story/StemDraw";
import WindEffect from "../story/WindEffect";
import SeedGroup, { type SeedFlight } from "../story/SeedGroup";
import SceneShell from "../story/SceneShell";
import SceneCamera from "../story/SceneCamera";
import Thread from "../story/Thread";
import { CAMERA_PRESETS } from "@/config/animation";
import type { PublicSlot } from "@/lib/story-data";

function buildFlights(slots: PublicSlot[]): SeedFlight[] {
  const defaults: SeedFlight[] = [
    { start: 0.3, pathType: "curveLeft",  x: "-28vw", y: "-16vw", rot: -22 },
    { start: 0.42, pathType: "curveRight", x: "22vw",  y: "-20vw", rot: 16 },
    { start: 0.54, pathType: "playful",   x: "-18vw", y: "10vw",  rot: -12 },
    { start: 0.66, pathType: "straight",  x: "24vw",  y: "2vw",   rot: 20 },
  ];

  return defaults.map((d, i) => {
    const mem = slots[i]?.memory;
    return {
      ...d,
      memory: mem ? { src: mem.mediaUrl, alt: mem.title || `seed ${i + 1}` } : undefined,
    };
  });
}

function Content({ p, slots }: { p: MotionValue<number>; slots: PublicSlot[] }) {
  const flights = buildFlights(slots);
  const fallenMemory = slots[0]?.memory ?? null;

  const stemLength = useTransform(p, [0, 0.12], [0, 1]);

  const headScale = useTransform(p, [0.1, 0.18], [0.2, 1]);
  const headOpacity = useTransform(p, [0.1, 0.16], [0, 1]);
  const headRotate = useTransform(p, [0.22, 0.3, 0.38, 0.46, 0.54], [0, 7, -5, 8, -3]);

  const landY = useTransform(p, [0.02, 0.1, 0.14], ["-50vh", "1.5vh", "0vh"]);
  const landRotate = useTransform(p, [0.02, 0.14], [-8, 4]);
  const landOpacity = useTransform(p, [0.02, 0.06], [0, 1]);

  const captionOpacity = useTransform(p, [0.62, 0.7, 0.9, 0.96], [0, 1, 1, 0]);

  return (
    <SceneCamera progress={p} config={CAMERA_PRESETS.dandelion}>
      <Thread progress={p} d="M40 -5 C 44 25, 36 55, 42 105" range={[0.82, 1]} />

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <StemDraw
          progress={p}
          d="M52 98 C 51 80, 53 66, 52 52"
          strokeWidth={0.7}
          range={[0, 0.12]}
        />
        <motion.line
          x1="20" y1="97" x2="84" y2="97"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.5}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: 0.35 }}
        />
      </svg>

      <WindEffect
        progress={p}
        range={[0.22, 0.56]}
        preset="medium"
        headRotate={headRotate}
      />

      <div className="absolute left-[52%] top-[52%] -translate-x-1/2">
        <motion.div
          className="h-36 w-36 sm:h-44 sm:w-44"
          style={{ scale: headScale, opacity: headOpacity, rotate: headRotate }}
        >
          <DandelionHead className="h-full w-full" />
        </motion.div>
      </div>

      <SeedGroup progress={p} flights={flights} />

      <div className="absolute left-[30%] top-[58%] w-40 -translate-x-1/2 sm:w-48">
        <motion.div style={{ y: landY, rotate: landRotate, opacity: landOpacity }}>
          {fallenMemory ? (
            <Polaroid
              src={fallenMemory.mediaUrl}
              alt={fallenMemory.title || "where it started"}
              aspectRatio="3/4"
              caption={fallenMemory.caption || "it drifted here"}
            />
          ) : (
            <div className="rounded-md bg-cloud p-2.5 pb-3 shadow-soft">
              <div className="flex aspect-[3/4] items-center justify-center bg-surface-muted rounded-sm">
                <svg viewBox="0 0 40 60" className="h-12 w-8 opacity-30">
                  <ellipse cx="20" cy="16" rx="6" ry="8" fill="var(--blush-2)" />
                  <path d="M20 24 C 20 36, 20 44, 20 58" stroke="var(--cocoa-soft)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <motion.p
        className="absolute bottom-[16%] font-hand text-2xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        the wind carries our stories.
      </motion.p>
    </SceneCamera>
  );
}

export default function DandelionScene({ slots }: { slots: PublicSlot[] }) {
  return (
    <SceneShell vh={420}>
      {(p) => <Content p={p} slots={slots} />}
    </SceneShell>
  );
}
