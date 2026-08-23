// Same seeds as src/scripts/seed.ts — Phase 8 replaces these with DB-driven media.
export const ph = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const DEMO_VIDEO = "https://res.cloudinary.com/demo/video/upload/dog.mp4";
