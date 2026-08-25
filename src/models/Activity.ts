import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, default: "" },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

export const Activity =
  mongoose.models.Activity ?? mongoose.model("Activity", activitySchema);
