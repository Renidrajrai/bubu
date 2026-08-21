import { loadEnvLocal } from "../lib/env";
import { createSignedUploadParams, default as cloudinary } from "../lib/cloudinary";
import { saveMediaAsset } from "../lib/media";
import { MediaAsset } from "../models/MediaAsset";
import { connectDB } from "../lib/mongodb";

loadEnvLocal();

// 1x1 png
const TEST_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function main() {
  await connectDB();
  console.log("1. connected to db");

  const signed = createSignedUploadParams("image");
  console.log("2. signed params:", { folder: signed.folder, formats: signed.allowed_formats });

  // wire format is a comma-joined string because that's what gets signed;
  // SDK typing wants arrays, runtime accepts both (proven by this test)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadOptions: any = {
    folder: signed.folder,
    allowed_formats: signed.allowed_formats,
    timestamp: signed.timestamp,
    signature: signed.signature,
    api_key: signed.apiKey,
  };
  const result = await cloudinary.uploader.upload(TEST_PNG, uploadOptions);
  console.log("3. uploaded:", result.public_id, result.secure_url.slice(0, 60) + "...");

  const asset = await saveMediaAsset({
    publicId: result.public_id,
    secureUrl: result.secure_url,
    mediaType: "image",
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  });
  console.log("4. saved MediaAsset:", String(asset._id), "thumb:", asset.thumbnailUrl.slice(0, 60) + "...");

  const reread = await MediaAsset.findOne({ publicId: result.public_id });
  if (!reread) throw new Error("MediaAsset not found after save");
  console.log("5. re-read from db OK");

  // cleanup: remove test asset from Cloudinary + db
  await cloudinary.uploader.destroy(result.public_id);
  await MediaAsset.deleteOne({ _id: asset._id });
  const gone = await MediaAsset.findOne({ publicId: result.public_id });
  if (gone) throw new Error("cleanup failed");
  console.log("6. cleaned up — ALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("TEST FAILED:", err);
    process.exit(1);
  });
