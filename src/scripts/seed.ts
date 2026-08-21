import { readFileSync } from "fs";
import { connectDB } from "../lib/mongodb";
import { Memory } from "../models/Memory";
import { Scene } from "../models/Scene";

// load .env.local (Next.js does this automatically, standalone scripts don't)
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const scenes = [
  { slug: "scene-01", title: "the beginning", order: 1 },
  { slug: "scene-02", title: "first memory", order: 2 },
  { slug: "scene-03", title: "connection", order: 3 },
  { slug: "scene-04", title: "moving pictures", order: 4 },
  { slug: "scene-05", title: "a little cluster", order: 5 },
  { slug: "scene-06", title: "quiet moment", order: 6 },
];

const memories = [
  {
    title: "where it started",
    caption: "the first photo i almost didn't take",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-01",
    cloudinaryUrl: img("pattu-01", 900, 1200),
    thumbnailUrl: img("pattu-01", 400, 533),
    category: "everyday",
    sceneId: "scene-01",
    slotId: "memory-01-main",
    order: 1,
    featured: true,
    displayMode: "portrait",
  },
  {
    title: "golden hour walk",
    caption: "we walked until the sun gave up",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-02",
    cloudinaryUrl: img("pattu-02", 1000, 750),
    thumbnailUrl: img("pattu-02", 500, 375),
    date: new Date("2025-06-14"),
    location: "the long road home",
    category: "everyday",
    sceneId: "scene-02",
    slotId: "memory-02-left",
    displayMode: "landscape",
  },
  {
    title: "your terrible coffee order",
    caption: "i still drink it wrong on purpose",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-03",
    cloudinaryUrl: img("pattu-03", 800, 800),
    thumbnailUrl: img("pattu-03", 400, 400),
    date: new Date("2025-07-02"),
    location: "that cafe with the wobbly table",
    category: "food",
    sceneId: "scene-02",
    slotId: "memory-02-right",
    displayMode: "square",
  },
  {
    title: "silly video evidence",
    caption: "you said delete this. i did not.",
    mediaType: "video" as const,
    cloudinaryPublicId: "demo/dog",
    cloudinaryUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    thumbnailUrl: img("pattu-video", 600, 400),
    date: new Date("2025-05-20"),
    category: "funny",
    sceneId: "scene-04",
    slotId: "memory-04-main",
    featured: true,
    displayMode: "cinematic",
  },
  {
    title: "cluster left",
    caption: "",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-05",
    cloudinaryUrl: img("pattu-05", 700, 900),
    thumbnailUrl: img("pattu-05", 350, 450),
    sceneId: "scene-05",
    slotId: "memory-05-left",
    displayMode: "collage",
  },
  {
    title: "cluster right",
    caption: "two of us, one frame",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-06",
    cloudinaryUrl: img("pattu-06", 900, 700),
    thumbnailUrl: img("pattu-06", 450, 350),
    date: new Date("2025-08-01"),
    sceneId: "scene-05",
    slotId: "memory-05-right",
    displayMode: "collage",
  },
];

async function main() {
  const conn = await connectDB();
  console.log("connected:", conn.connection.name);

  await Promise.all([Scene.deleteMany({}), Memory.deleteMany({})]);
  const sceneDocs = await Scene.insertMany(scenes);
  const memoryDocs = await Memory.insertMany(memories);

  console.log(`scenes: ${sceneDocs.length}, memories: ${memoryDocs.length}`);
  const check = await Memory.findOne({ featured: true });
  console.log("sample featured memory:", check?.title, "->", check?.slotId);

  const updated = await Memory.updateOne(
    { slotId: "memory-02-left" },
    { $set: { caption: "caption edited via CRUD smoke test" } }
  );
  console.log("crud update matched:", updated.matchedCount);

  await mongoose_disconnect();
}

function mongoose_disconnect() {
  return import("mongoose").then((m) => m.default.disconnect());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
