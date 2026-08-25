import mongoose, { Schema } from "mongoose";

const memorySchema = new Schema(
  {
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    cloudinaryPublicId: { type: String, default: "" },
    cloudinaryUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    date: { type: Date },
    location: { type: String, default: "" },
    category: { type: String, default: "everyday" },
    sceneId: { type: String, default: null },
    slotId: { type: String, default: null },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    visibility: { type: String, enum: ["public", "hidden"], default: "public" },
    placement: { type: String, enum: ["story", "archive"], default: "archive" },
    objectPosition: { type: String, default: "center" },
    displayMode: {
      type: String,
      enum: ["portrait", "landscape", "square", "floating", "polaroid", "collage", "inline", "cinematic"],
      default: "inline",
    },
  },
  { timestamps: true }
);

memorySchema.index({ visibility: 1, date: -1 });
memorySchema.index({ sceneId: 1, slotId: 1 });

export const Memory =
  mongoose.models.Memory ?? mongoose.model("Memory", memorySchema);

export type MemoryDoc = mongoose.InferSchemaType<typeof memorySchema>;
