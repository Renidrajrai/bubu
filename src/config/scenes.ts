// Structural story configuration (spec §56) — dynamic content lives in MongoDB.
// Slot ids here are stable animation anchors; any memory can occupy a slot.
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

export const STORY_SCENES: StoryScene[] = [
  {
    slug: "scene-01",
    title: "the beginning",
    slots: [{ id: "memory-01-main", label: "main", aspectRatio: "3/4" }],
  },
  {
    slug: "scene-02",
    title: "first memory",
    slots: [
      { id: "memory-02-left", label: "left", aspectRatio: "4/3" },
      { id: "memory-02-right", label: "right", aspectRatio: "1/1" },
    ],
  },
  {
    slug: "scene-03",
    title: "connection",
    slots: [{ id: "memory-03-main", label: "main", aspectRatio: "3/4" }],
  },
  {
    slug: "scene-04",
    title: "moving pictures",
    slots: [{ id: "memory-04-main", label: "video", aspectRatio: "16/9" }],
  },
  {
    slug: "scene-05",
    title: "a little cluster",
    slots: [
      { id: "memory-05-left", label: "left", aspectRatio: "3/4" },
      { id: "memory-05-right", label: "right", aspectRatio: "5/4" },
    ],
  },
  {
    slug: "scene-06",
    title: "quiet moment",
    slots: [{ id: "memory-06-main", label: "cinematic", aspectRatio: "16/9" }],
  },
];

export function findSlot(sceneSlug: string, slotId: string) {
  return STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots.find((sl) => sl.id === slotId);
}

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
