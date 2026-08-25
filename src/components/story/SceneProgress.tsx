"use client";

import { createContext, useContext } from "react";
import { useTransform, type MotionValue } from "motion/react";
import { SCROLL_RANGES } from "@/config/animation";

// ── Context ───────────────────────────────────────────────────────

type SceneProgressContext = {
  progress: MotionValue<number>;
  entryProgress: MotionValue<number>;
  activeProgress: MotionValue<number>;
  exitProgress: MotionValue<number>;
};

const SceneProgressCtx = createContext<SceneProgressContext | null>(null);

export function useSceneProgress() {
  const ctx = useContext(SceneProgressCtx);
  if (!ctx) throw new Error("useSceneProgress must be used within <SceneProgress>");
  return ctx;
}

// ── Component ─────────────────────────────────────────────────────
// §30: splits raw scrollYProgress into entry/active/exit phases
// using SCROLL_RANGES from animation config.

export default function SceneProgress({
  slug,
  progress,
  children,
}: {
  slug: string;
  progress: MotionValue<number>;
  children: (ctx: SceneProgressContext) => React.ReactNode;
}) {
  const ranges = SCROLL_RANGES[slug] ?? SCROLL_RANGES.intro;

  const entryProgress = useTransform(
    progress,
    [ranges.entry[0], ranges.entry[1]],
    [0, 1],
  );
  const activeProgress = useTransform(
    progress,
    [ranges.active[0], ranges.active[1]],
    [0, 1],
  );
  const exitProgress = useTransform(
    progress,
    [ranges.exit[0], ranges.exit[1]],
    [0, 1],
  );

  const ctx: SceneProgressContext = {
    progress,
    entryProgress,
    activeProgress,
    exitProgress,
  };

  return (
    <SceneProgressCtx.Provider value={ctx}>
      {children(ctx)}
    </SceneProgressCtx.Provider>
  );
}
