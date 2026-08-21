import { z } from "zod";
import cloudinary, {
  imageThumbnailUrl,
  requireCloudinaryEnv,
  videoThumbnailUrl,
} from "./cloudinary";
import { MediaAsset } from "../models/MediaAsset";
import type { saveAssetSchema } from "./validations";

export type SaveAssetInput = z.infer<typeof saveAssetSchema>;

// Verifies the asset really exists on Cloudinary before trusting client metadata,
// then upserts a MediaAsset record. Shared by /api/upload and scripts.
export async function saveMediaAsset(input: SaveAssetInput) {
  requireCloudinaryEnv();

  const resourceType = input.mediaType === "video" ? "video" : "image";
  const resource = await cloudinary.api.resource(input.publicId, {
    resource_type: resourceType,
  });
  if (!resource?.public_id) throw new Error("Asset not found on Cloudinary");

  const thumbnailUrl =
    input.mediaType === "video"
      ? videoThumbnailUrl(input.publicId)
      : imageThumbnailUrl(input.publicId);

  return MediaAsset.findOneAndUpdate(
    { publicId: input.publicId },
    {
      $set: {
        mediaType: input.mediaType,
        publicId: input.publicId,
        url: input.secureUrl,
        thumbnailUrl,
        width: input.width ?? resource.width,
        height: input.height ?? resource.height,
        format: input.format ?? resource.format,
        bytes: input.bytes ?? resource.bytes,
        duration: input.duration ?? resource.duration,
      },
    },
    { new: true, returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
}
