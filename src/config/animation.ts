// §73: Animation config — single source of truth for all timing, paths, and presets.
// Every scene references this file. Change timing here, not in individual components.

import type {
  CameraPreset,
  FlowerTiming,
  MemoryTiming,
  ReducedMotionOverrides,
  SceneChemistry,
  ScrollRange,
  SeedPathType,
  WindPreset,
  PaperVariant,
} from "@/types/story";

// ── Flower Growth Timing (§99–§101) ───────────────────────────────
// Scroll fraction budgets per growth stage. Sum can exceed 1 — stages overlap.

export const FLOWER_TIMING: FlowerTiming = {
  stem: 0.35,    // stem draws over 35% of scene scroll
  leaves: 0.25,  // leaves unfurl over 25%
  bud: 0.2,      // bud swells over 20%
  petals: 0.3,   // petals open over 30%
  center: 0.15,  // center appears over 15%
};

// ── Memory Transition Timing (§81–§86) ────────────────────────────

export const MEMORY_TIMING: MemoryTiming = {
  petalDetach: 0.25, // petal separates from flower
  reveal: 0.35,      // image fades in, caption slides
  settle: 0.2,       // card settles into final position
};

// ── Camera Presets (§95–§97) ──────────────────────────────────────
// Per-scene camera framing. Scale in CSS units, Y in px.

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  intro:     { startScale: 1.15, endScale: 1.05, startY: 20,  endY: -10 },
  bloom:     { startScale: 1.0,  endScale: 1.08, startY: 0,   endY: -30 },
  dandelion: { startScale: 1.05, endScale: 1.0,  startY: 10,  endY: -20 },
  grow:      { startScale: 1.0,  endScale: 1.05, startY: 0,   endY: -15 },
  ending:    { startScale: 1.0,  endScale: 0.98, startY: 0,   endY: 0 },
};

// ── Scene Chemistry (§95) ─────────────────────────────────────────
// Overlap ranges for scene transitions. Values are normalized scroll positions.

export const SCENE_CHEMISTRY: Record<string, SceneChemistry> = {
  "intro→bloom":     { overlap: [0.88, 1.0], crossfade: true },
  "bloom→dandelion": { overlap: [0.85, 1.0], crossfade: true },
  "dandelion→grow":  { overlap: [0.87, 1.0], crossfade: true },
  "grow→ending":     { overlap: [0.9, 1.0],  crossfade: true },
};

// ── Scroll Ranges (§30) ───────────────────────────────────────────
// Normalized scroll ranges for each scene's lifecycle phases.

export const SCROLL_RANGES: Record<string, ScrollRange> = {
  intro: {
    entry:   [0, 0.15],
    active:  [0.15, 0.85],
    exit:    [0.85, 1.0],
  },
  bloom: {
    entry:   [0, 0.12],
    active:  [0.12, 0.88],
    exit:    [0.88, 1.0],
  },
  dandelion: {
    entry:   [0, 0.1],
    active:  [0.1, 0.9],
    exit:    [0.9, 1.0],
  },
  grow: {
    entry:   [0, 0.1],
    active:  [0.1, 0.85],
    exit:    [0.85, 1.0],
  },
  ending: {
    entry:   [0, 0.2],
    active:  [0.2, 1.0],
    exit:    [1.0, 1.0], // no exit — final scene
  },
};

// ── Seed Paths (§104–§107) ────────────────────────────────────────
// SVG path `d` strings for seed flight trajectories.

export const SEED_PATHS: Record<SeedPathType, string> = {
  straight:   "M 50 30 L 50 85",
  curveLeft:  "M 50 30 C 50 50, 30 60, 25 85",
  curveRight: "M 50 30 C 50 50, 70 60, 75 85",
  playful:    "M 50 30 C 60 45, 35 55, 55 65 C 40 72, 50 80, 45 85",
};

// ── Wind Configs (§103, §110) ─────────────────────────────────────
// Head-bend angles and wind duration per preset.

export const WIND_CONFIGS: Record<WindPreset, { bendAngle: number; duration: number }> = {
  gentle:  { bendAngle: 8,  duration: 0.4 },
  medium:  { bendAngle: 15, duration: 0.35 },
  strong:  { bendAngle: 22, duration: 0.3 },
  playful: { bendAngle: 12, duration: 0.5 },
};

// ── Paper Variants (§85, §117) ────────────────────────────────────
// Rotation (deg), tilt (deg), blur (px) ranges for memory cards.

export const PAPER_VARIANTS: Record<PaperVariant, { rotation: number; tilt: number; blur: number }> = {
  standard: { rotation: 0,   tilt: 0,   blur: 0 },
  scrapbook: { rotation: 2.5, tilt: 1.5, blur: 0 },
  vintage:  { rotation: -1,  tilt: 0.5, blur: 0.3 },
};

// ── Reduced Motion Overrides (§125, §129) ─────────────────────────
// Same structure as defaults but with instant/simplified values.

export const REDUCED_MOTION_OVERRIDES: ReducedMotionOverrides = {
  flowerTiming: {
    stem: 1.0,     // instant draw
    leaves: 1.0,
    bud: 1.0,
    petals: 1.0,
    center: 1.0,
  },
  memoryTiming: {
    petalDetach: 0.5,
    reveal: 0.5,
    settle: 0,
  },
  cameraPreset: {
    startScale: 1.0,
    endScale: 1.0,
    startY: 0,
    endY: 0,
  },
};

// ── Background Mood Palette (§105) ────────────────────────────────
// Per-scene background colors for scroll-linked interpolation.

export const MOOD_PALETTE: Record<string, { start: string; end: string }> = {
  intro:     { start: "var(--cream)",   end: "var(--cream)" },
  bloom:     { start: "var(--cream)",   end: "var(--blush)" },
  dandelion: { start: "var(--blush)",   end: "var(--cream)" },
  grow:      { start: "var(--cream)",   end: "var(--sage-tint)" },
  ending:    { start: "var(--sage-tint)", end: "var(--cream)" },
};
