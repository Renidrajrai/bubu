import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    siteTitle: { type: String, default: "bubu & dudu" },
    introText: { type: String, default: "" },
    archiveEnabled: { type: Boolean, default: true },
    storyEnabled: { type: Boolean, default: true },
    defaultDisplayMode: { type: String, default: "inline" },
    defaultObjectPosition: { type: String, default: "center" },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings ?? mongoose.model("Settings", settingsSchema);

export type SettingsDoc = mongoose.InferSchemaType<typeof settingsSchema>;
