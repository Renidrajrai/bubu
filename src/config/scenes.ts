// Structural story configuration (spec §56) — dynamic content lives in MongoDB.
// Slot ids here are stable animation anchors; any memory can occupy a slot.
import type {
  CameraPreset,
  ConnectorType,
  MemoryReveal,
  SeedPathType,
  SlotConfig,
  WindPreset,
} from "@/types/story";
import { CAMERA_PRESETS } from "./animation";

// ── Base types (used by admin system) ─────────────────────────────

export type StorySlot = {
  id: string;
  label: string;
  aspectRatio: string; // CSS aspect-ratio, e.g. "3/4"
};

export type StoryScene = {
  slug: string;
  title: string;
  slots: StorySlot[];
};

// ── Story scenes (5 beats from visual spec) ───────────────────────

export const STORY_SCENES: StoryScene[] = [
  {
    slug: "intro",
    title: "the beginning",
    slots: [{ id: "intro-hero", label: "hero photo", aspectRatio: "3/4" }],
  },
  {
    slug: "bloom",
    title: "first bloom",
    slots: [{ id: "bloom-main", label: "main", aspectRatio: "3/4" }],
  },
  {
    slug: "dandelion",
    title: "seeds take flight",
    slots: [
      { id: "dandelion-01", label: "seed 1", aspectRatio: "3/4" },
      { id: "dandelion-02", label: "seed 2", aspectRatio: "1/1" },
      { id: "dandelion-03", label: "seed 3", aspectRatio: "4/3" },
      { id: "dandelion-04", label: "seed 4", aspectRatio: "3/4" },
    ],
  },
  {
    slug: "grow",
    title: "taking root",
    slots: [
      { id: "grow-01", label: "flower 1", aspectRatio: "3/4" },
      { id: "grow-02", label: "flower 2", aspectRatio: "4/3" },
      { id: "grow-03", label: "flower 3", aspectRatio: "1/1" },
    ],
  },
  {
    slug: "ending",
    title: "the story keeps going",
    slots: [],
  },
];

// ── Visual scene config (§70) — full animation spec per scene ─────

export type VisualSceneConfig = {
  slug: string;
  connectorType: ConnectorType;
  windPreset: WindPreset;
  seedPath: SeedPathType;
  memoryReveal: MemoryReveal;
  cameraPreset: CameraPreset;
  slotOverrides: SlotConfig[];
};

export const VISUAL_SCENES: VisualSceneConfig[] = [
  {
    slug: "intro",
    connectorType: "thread",
    windPreset: "gentle",
    seedPath: "straight",
    memoryReveal: "dissolve",
    cameraPreset: CAMERA_PRESETS.intro,
    slotOverrides: [
      { id: "intro-hero", label: "hero photo", aspectRatio: "3/4" },
    ],
  },
  {
    slug: "bloom",
    connectorType: "stem",
    windPreset: "gentle",
    seedPath: "straight",
    memoryReveal: "slide",
    cameraPreset: CAMERA_PRESETS.bloom,
    slotOverrides: [
      { id: "bloom-main", label: "main", aspectRatio: "3/4" },
    ],
  },
  {
    slug: "dandelion",
    connectorType: "vine",
    windPreset: "medium",
    seedPath: "curveRight",
    memoryReveal: "scale",
    cameraPreset: CAMERA_PRESETS.dandelion,
    slotOverrides: [
      { id: "dandelion-01", label: "seed 1", aspectRatio: "3/4" },
      { id: "dandelion-02", label: "seed 2", aspectRatio: "1/1" },
      { id: "dandelion-03", label: "seed 3", aspectRatio: "4/3" },
      { id: "dandelion-04", label: "seed 4", aspectRatio: "3/4" },
    ],
  },
  {
    slug: "grow",
    connectorType: "vine",
    windPreset: "gentle",
    seedPath: "playful",
    memoryReveal: "gentleBlur",
    cameraPreset: CAMERA_PRESETS.grow,
    slotOverrides: [
      { id: "grow-01", label: "flower 1", aspectRatio: "3/4" },
      { id: "grow-02", label: "flower 2", aspectRatio: "4/3" },
      { id: "grow-03", label: "flower 3", aspectRatio: "1/1" },
    ],
  },
  {
    slug: "ending",
    connectorType: "doodle",
    windPreset: "gentle",
    seedPath: "straight",
    memoryReveal: "dissolve",
    cameraPreset: CAMERA_PRESETS.ending,
    slotOverrides: [],
  },
];

// ── Helpers ───────────────────────────────────────────────────────

export function findSlot(sceneSlug: string, slotId: string) {
  return STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots.find((sl) => sl.id === slotId);
}

export function getVisualScene(slug: string) {
  return VISUAL_SCENES.find((v) => v.slug === slug);
}

// ── Constants (unchanged — used by admin) ─────────────────────────

export const DISPLAY_MODES = [
  "portrait",
  "landscape",
  "square",
  "floating",
  "polaroid",
  "collage",
  "inline",
  "cinematic",
] as const;

export const CATEGORIES = [
  "everyday",
  "trip",
  "food",
  "funny",
  "birthday",
] as const;
