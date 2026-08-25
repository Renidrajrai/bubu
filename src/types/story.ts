// ── Story Visual Spec Types ────────────────────────────────────────
// §73: animation config file centralizes all timing values.
// These types define the shape of that config and the story architecture.

// ── Seed Paths (§104–§107) ────────────────────────────────────────

export type SeedPathType = "straight" | "curveLeft" | "curveRight" | "playful";

// ── Wind Presets (§103, §110) ─────────────────────────────────────

export type WindPreset = "gentle" | "medium" | "strong" | "playful";

// ── Memory Reveal (§84–§86) ───────────────────────────────────────

export type MemoryReveal = "dissolve" | "slide" | "scale" | "gentleBlur";

// ── Paper Treatment (§85, §117) ───────────────────────────────────

export type PaperVariant = "standard" | "scrapbook" | "vintage";

// ── Connector Types (§94, §96) ───────────────────────────────────

export type ConnectorType = "stem" | "vine" | "thread" | "doodle";

// ── Camera Preset (§95–§97) ───────────────────────────────────────

export type CameraPreset = {
  startScale: number;
  endScale: number;
  startY: number;   // px offset at scene start
  endY: number;     // px offset at scene end
};

// ── Scene Chemistry (§95) ─────────────────────────────────────────

export type SceneChemistry = {
  overlap: [number, number]; // normalized scroll range for crossfade
  crossfade: boolean;
};

// ── Scroll Range (§30) ────────────────────────────────────────────

export type ScrollRange = {
  entry: [number, number];
  active: [number, number];
  exit: [number, number];
};

// ── Flower Growth Timing (§99–§101) ───────────────────────────────

export type FlowerTiming = {
  stem: number;     // scroll fraction for stem draw
  leaves: number;   // scroll fraction for leaf unfurl
  bud: number;      // scroll fraction for bud swell
  petals: number;   // scroll fraction for petal open
  center: number;   // scroll fraction for center appear
};

// ── Memory Transition Timing (§81–§86) ────────────────────────────

export type MemoryTiming = {
  petalDetach: number;
  reveal: number;
  settle: number;
};

// ── Slot Config (enhanced StorySlot) ──────────────────────────────

export type SlotConfig = {
  id: string;
  label: string;
  aspectRatio: string;
  memoryId?: string;      // primary memory assignment (from admin)
  fallbackArt?: string;   // illustration when slot is empty
};

// ── Scene Config (§70) ────────────────────────────────────────────

export type SceneConfig = {
  id: string;
  slug: string;
  title: string;
  connectorType: ConnectorType;
  windPreset: WindPreset;
  seedPath: SeedPathType;
  memoryReveal: MemoryReveal;
  cameraPreset: CameraPreset;
  slots: SlotConfig[];
};

// ── Reduced Motion Overrides (§125, §129) ─────────────────────────

export type ReducedMotionOverrides = {
  flowerTiming: FlowerTiming;
  memoryTiming: MemoryTiming;
  cameraPreset: CameraPreset;
};

// ── Story Config Root ─────────────────────────────────────────────

export type StoryConfig = {
  scenes: SceneConfig[];
  flowerTiming: FlowerTiming;
  memoryTiming: MemoryTiming;
  sceneChemistry: Record<string, SceneChemistry>;
  scrollRanges: Record<string, ScrollRange>;
  cameraPresets: Record<string, CameraPreset>;
  seedPaths: Record<SeedPathType, string>;  // SVG path `d` strings
  windConfigs: Record<WindPreset, { bendAngle: number; duration: number }>;
  paperVariants: Record<PaperVariant, { rotation: number; tilt: number; blur: number }>;
  reducedMotion: ReducedMotionOverrides;
};
