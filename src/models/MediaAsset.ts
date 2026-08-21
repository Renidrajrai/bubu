import mongoose, { Schema } from "mongoose";

const mediaAssetSchema = new Schema(
  {
    mediaType: { type: String, enum: ["image", "video"], required: true },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    format: { type: String, default: "" },
    bytes: { type: Number },
    duration: { type: Number },
  },
  { timestamps: true }
);

mediaAssetSchema.index({ publicId: 1 }, { unique: true });

export const MediaAsset =
  mongoose.models.MediaAsset ?? mongoose.model("MediaAsset", mediaAssetSchema);

export type MediaAssetDoc = mongoose.InferSchemaType<typeof mediaAssetSchema>;
