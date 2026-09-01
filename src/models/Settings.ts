import mongoose, { Schema } from "mongoose";

// Editorially editable narrative text — the public page reads this so the
// site is about Pattu without any hardcoded copy. Behind a free-form document
// so adding a new line needs no schema change (#7/#16).
export const STORY_TEXT_DEFAULTS: Record<string, string> = {
  heroName: "Aayush Rajbhandari",
  heroTag: "✦ aka pattu",
  heroKicker:
    "A very serious archive of one very pretty boy. No further explanation.",
  heroStrap: "he thinks i only have a few pictures of him.",
  heroStrapAccent: "he does not know.",
  eyesPoetic: "the eyes that make the greatest poets write poems about.",
  eyesLoveNote:
    "my baby, kuchu puchu — i love you so so much. i will forever be enchanted by your eyes.",
  cameraSub: "Unposed, mostly unaware, always the best shots in the roll.",
  candidSub: "The best ones are always the ones he doesn't know were taken.",
  videoSub: "The ones where the sound matters too. Hover to peek, tap to press play.",
  finalButton: "pattu — if you're reading this, it means i finally sent it to you...",
  finalLetter: [
    "If you're reading this, it means I finally sent it to you. I've been collecting these pictures for a while now — not because I needed proof of anything, just because I like keeping the good parts.",
    "You have this way of making ordinary days feel like something worth remembering. The eyes, obviously. But also just — you, mid-sentence, laughing at something only you find funny, completely unaware anyone's watching.",
    "Thank you for being so easy to love, and so hard to stop looking at.",
  ].join("\n\n"),
};

const settingsSchema = new Schema(
  {
    siteTitle: { type: String, default: "pattu" },
    introText: { type: String, default: "" },
    archiveEnabled: { type: Boolean, default: true },
    storyEnabled: { type: Boolean, default: true },
    defaultDisplayMode: { type: String, default: "inline" },
    defaultObjectPosition: { type: String, default: "center" },
    storyText: { type: Schema.Types.Mixed, default: { ...STORY_TEXT_DEFAULTS } },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings ?? mongoose.model("Settings", settingsSchema);

export type SettingsDoc = mongoose.InferSchemaType<typeof settingsSchema>;
