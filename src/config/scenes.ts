// Structural constants for the zine site — used by the admin.
// Categories map a photo to a live page section. Display modes drive styling.

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
  // everyday life tags
  "everyday",
  "trip",
  "food",
  "funny",
  "birthday",
  // zine sections — a photo tagged with one of these fills that spread
  "hero",
  "eyes",
  "cameraroll",
  "poster",
  "candid",
  "final",
] as const;
