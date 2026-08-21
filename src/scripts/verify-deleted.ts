import { loadEnvLocal } from "../lib/env";
import { default as cloudinary, requireCloudinaryEnv } from "../lib/cloudinary";
import { connectDB } from "../lib/mongodb";
import { MediaAsset } from "../models/MediaAsset";
import { Memory } from "../models/Memory";

loadEnvLocal();

async function main() {
  const publicId = process.argv[2];
  if (!publicId) throw new Error("usage: tsx verify-deleted.ts <publicId>");

  await connectDB();
  const dbAsset = await MediaAsset.findOne({ publicId });
  const dbMemory = await Memory.findOne({ cloudinaryPublicId: publicId });

  requireCloudinaryEnv();
  let cloudinaryState = "gone";
  try {
    await cloudinary.api.resource(publicId, { resource_type: "image" });
    cloudinaryState = "STILL EXISTS";
  } catch {
    // 404 → destroyed
  }

  console.log(`verify: dbAsset=${dbAsset ? "STILL EXISTS" : "gone"} dbMemory=${dbMemory ? "STILL EXISTS" : "gone"} cloudinary=${cloudinaryState}`);
  if (dbAsset || dbMemory || cloudinaryState !== "gone") process.exit(1);
  console.log("DELETE CHAIN FULLY VERIFIED");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("verify failed:", err);
    process.exit(1);
  });
