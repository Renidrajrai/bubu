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
    "Hello, Pattu. My love, my greatest love of all time, my first love. I love you very, very much.",
    "This is my first time being with someone this good in my life, and honestly, sometimes I don’t even know what to say. Every birthday, I try to do something extra for you. Sometimes I think, “Maybe I shouldn’t do this much for anyone.” But then I look at your face and I’m like, “Oh, I need to.” There is something I must do to serve this face that I got from the gods, or maybe the angels.",
    "I love you very much. There are so many things I want to say, but I don’t think I can put all of them into words. I loved you from the moment I saw you. Well, not technically, but still. I love you very, very much. I loved you from the moment you blocked that other person who was talking to you.",
    "And I think it was fate that we met. We met so slowly, so gradually. Nothing felt overpowering or rushed, and somehow, that made me think, “Yes, I think everything happened for a reason.” I met you for a reason. I met you because I was born to love you. I was born to take care of you. I was born to cherish you. And you were born to be mine. At least, that’s how I feel.",
    "But yeah, it’s just that I love you very, very much. I don’t even know what else to say. Just be with me for the rest of your life, and I will take care of you for the rest of mine. I will love you until the moon gets blown away, until it doesn’t exist anymore. I will love you in my next lifetime, and the lifetime after that, and another one after that, if there is one. I will love you.",
    "Please, please be with me for the rest of your life. We have so many plans. We want to go to different countries, and I can’t wait to experience all of that with you. Just going places, seeing new things, traveling together, eating lots of food, even though I’m dieting right now, I’ll eat with you, even if it’s just a bite.",
    "I want to go out with you and have fun freely, with no one around to judge us. I want us to have our own room, our own space, and just be together. I don’t want to feel that pain I feel every time you leave my house anymore. I want that so badly for us. I want to be able to wake up beside you, spend my days with you, and not have to say goodbye and feel that emptyness afterward.",
    "And I will make that happen. I will do everything I can so that we can be happy together. I will love you like this until I’m very, very old. And even when I can’t do everything I want to do for you, I will still try my best. I will always try my best to take care of you, to take care of your needs, and to make you feel loved.",
    "So please, love me. And I love you. That’s all I can say right now. I love you, baby.",
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
    adminPasswordHashHex: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings ?? mongoose.model("Settings", settingsSchema);

export type SettingsDoc = mongoose.InferSchemaType<typeof settingsSchema>;
