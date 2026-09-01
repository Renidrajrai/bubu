import mongoose from "mongoose";
import { loadEnvLocal } from "../lib/env";
import { connectDB } from "../lib/mongodb";
import { Memory } from "../models/Memory";

// Next.js loads .env.local automatically; standalone scripts don't
loadEnvLocal();

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const memories = [
  {
    title: "where it started",
    caption: "the first photo i almost didn't take",
    mediaType: "image" as const,
    cloudinaryPublicId: "placeholder/pattu-01",
    cloudinaryUrl: img("pattu-01", 900, 1200),
    thumbnailUrl: img("pattu-01", 400, 533),
    category: "hero",
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
    category: "eyes",
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
    category: "food",
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
    category: "candid",
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
    category: "cameraroll",
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
    category: "poster",
    displayMode: "collage",
  },
];

async function main() {
  const conn = await connectDB();
  console.log("connected:", conn.connection.name);

  await Memory.deleteMany({});
  const memoryDocs = await Memory.insertMany(memories);

  console.log(`memories: ${memoryDocs.length}`);
  const check = await Memory.findOne({ featured: true });
  console.log("sample featured memory:", check?.title, "->", check?.category);

  const updated = await Memory.updateOne(
    { title: "golden hour walk" },
    { $set: { caption: "caption edited via CRUD smoke test" } }
  );
  console.log("crud update matched:", updated.matchedCount);

  await mongoose.disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
