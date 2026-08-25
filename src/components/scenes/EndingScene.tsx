"use client";

import { useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import ArchiveOverlay from "../archive/ArchiveOverlay";
import SceneShell from "../story/SceneShell";
import SceneCamera from "../story/SceneCamera";
import { CAMERA_PRESETS } from "@/config/animation";
import type { PublicMemory } from "@/lib/story-data";

function EndingContent({ p, archive }: { p: MotionValue<number>; archive: PublicMemory[] }) {
  const [open, setOpen] = useState(false);

  const textOpacity = useTransform(p, [0.2, 0.4, 0.8, 1], [0, 1, 1, 0.8]);
  const textY = useTransform(p, [0.2, 0.4], [30, 0]);
  const buttonOpacity = useTransform(p, [0.4, 0.55], [0, 1]);

  return (
    <SceneCamera progress={p} config={CAMERA_PRESETS.ending}>
      <motion.div
        className="flex min-h-full w-full flex-col items-center justify-center px-4 text-center"
        style={{ opacity: textOpacity, y: textY }}
      >
        <h2 className="font-display text-2xl font-semibold text-cocoa sm:text-3xl md:text-4xl">
          the story keeps going
          <span className="ml-2 font-hand text-3xl font-bold text-rose sm:text-4xl md:text-5xl">
            , obviously.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-sm font-medium leading-relaxed text-cocoa-soft">
          new memories bloom, drift, and take root — same garden, next seed.
        </p>

        <motion.button
          onClick={() => setOpen(true)}
          style={{ opacity: buttonOpacity }}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cocoa px-6 py-3 font-display text-sm font-medium tracking-wide text-cloud shadow-soft transition-transform duration-300 [transition-timing-function:var(--ease-pop)] hover:scale-105 active:scale-95"
        >
          see every memory
        </motion.button>
      </motion.div>

      <ArchiveOverlay open={open} onClose={() => setOpen(false)} memories={archive} />
    </SceneCamera>
  );
}

export default function EndingScene({ archive }: { archive: PublicMemory[] }) {
  return (
    <SceneShell vh={300}>
      {(p) => <EndingContent p={p} archive={archive} />}
    </SceneShell>
  );
}
