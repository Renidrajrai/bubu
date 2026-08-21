import mongoose, { Schema } from "mongoose";

// Dynamic scene metadata only — structural animation lives in config/scenes.ts (spec §56)
const sceneSchema = new Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    background: { type: String, default: "cream" },
  },
  { timestamps: true }
);

sceneSchema.index({ slug: 1 }, { unique: true });

export const Scene =
  mongoose.models.Scene ?? mongoose.model("Scene", sceneSchema);

export type SceneDoc = mongoose.InferSchemaType<typeof sceneSchema>;
