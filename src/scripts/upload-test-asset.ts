import { loadEnvLocal } from "../lib/env";
import { default as cloudinary, createSignedUploadParams } from "../lib/cloudinary";
import { writeFileSync } from "fs";

loadEnvLocal();

async function main() {
  const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const signed = createSignedUploadParams("image");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const opts: any = { folder: signed.folder, allowed_formats: signed.allowed_formats, timestamp: signed.timestamp, signature: signed.signature, api_key: signed.apiKey };
  const up = await cloudinary.uploader.upload(png, opts);
  writeFileSync("C:/Users/ASUS/AppData/Local/Temp/opencode/testasset.json", JSON.stringify({ publicId: up.public_id, url: up.secure_url }));
  console.log("uploaded:", up.public_id);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("upload failed:", err);
    process.exit(1);
  });
