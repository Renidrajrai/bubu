import { readdir } from "fs/promises";
import { join, extname, basename } from "path";
import cloudinary, { requireCloudinaryEnv } from "../lib/cloudinary";
import { loadEnvLocal } from "../lib/env";
import { connectDB } from "../lib/mongodb";
import { Memory } from "../models/Memory";
import { MediaAsset } from "../models/MediaAsset";

loadEnvLocal();

const IMPORT_DIR = join(process.cwd(), "import");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

// <extension> -> media type
function mediaTypeOf(file: string): "image" | "video" | null {
  const ext = extname(file).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return null;
}

// Recursively collect files (skips hidden/system entries).
async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (e.isFile()) {
      files.push(full);
    }
  }
  return files.sort();
}

// Highest existing sequence index for a public-id prefix, so re-runs resume.
async function nextIndex(prefix: string): Promise<number> {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const assets = await MediaAsset.find({ publicId: new RegExp(`${prefix}-\\d+`) })
    .select("publicId")
    .lean();
  let max = 0;
  for (const a of assets) {
    const part = a.publicId.split("/").pop() ?? "";
    const m = part.match(pattern);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

async function main() {
  const conn = await connectDB();
  console.log("connected:", conn.connection.name);

  requireCloudinaryEnv();
  const files = await collectFiles(IMPORT_DIR);

  const todo = files
    .map((f) => ({ path: f, mediaType: mediaTypeOf(f) }))
    .filter((f): f is { path: string; mediaType: "image" | "video" } => f.mediaType !== null);

  console.log(`found ${files.length} files, ${todo.length} importable (photos + videos)`);

  const counters = { image: await nextIndex("pattu"), video: await nextIndex("vid") };
  const report = { uploaded: 0, skipped: 0, failed: 0 };

  for (const { path, mediaType } of todo) {
    const isVideo = mediaType === "video";
    const prefix = isVideo ? "vid" : "pattu";
    const folder = isVideo ? "boyfriend-site/videos" : "boyfriend-site/images";
    const baseId = `${prefix}-${String(counters[mediaType]).padStart(3, "0")}`;
    const fullPublicId = `${folder}/${baseId}`;

    // Already imported? The MediaAsset.publicId is unique — skip if present.
    const existing = await MediaAsset.findOne({ publicId: fullPublicId }).lean();
    if (existing) {
      report.skipped += 1;
      console.log(`[skip] ${basename(path)} -> ${baseId} (already imported)`);
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(path, {
        folder,
        public_id: baseId,
        resource_type: isVideo ? "video" : "image",
      });

      const secureUrl = result.secure_url;
      const thumbnailUrl = isVideo
        ? cloudinary.utils.video_thumbnail_url(fullPublicId, { secure: true })
        : cloudinary.url(fullPublicId, {
            width: 400,
            height: 400,
            crop: "fill",
            format: "jpg",
            secure: true,
          });

      await MediaAsset.findOneAndUpdate(
        { publicId: fullPublicId },
        {
          $set: {
            mediaType,
            publicId: fullPublicId,
            url: secureUrl,
            thumbnailUrl,
            width: result.width ?? undefined,
            height: result.height ?? undefined,
            format: result.format ?? "",
            bytes: result.bytes ?? undefined,
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
      );

      await Memory.create({
        title: baseId,
        caption: baseId,
        mediaType,
        cloudinaryPublicId: fullPublicId,
        cloudinaryUrl: secureUrl,
        thumbnailUrl,
        category: "everyday",
        visibility: "public",
        placement: "archive",
        displayMode: "inline",
      });

      report.uploaded += 1;
      console.log(`[ok] ${basename(path)} -> ${baseId} (${mediaType})`);
      counters[mediaType] += 1;
    } catch (err) {
      report.failed += 1;
      console.error(`[FAIL] ${basename(path)} (${baseId}):`, err instanceof Error ? err.message : err);
    }
  }

  const photos = todo.filter((t) => t.mediaType === "image").length;
  const videos = todo.filter((t) => t.mediaType === "video").length;
  console.log(
    `done. files: ${todo.length} (photos: ${photos}, videos: ${videos}), uploaded: ${report.uploaded}, skipped: ${report.skipped}, failed: ${report.failed}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("import-folder failed:", err);
    process.exit(1);
  });
