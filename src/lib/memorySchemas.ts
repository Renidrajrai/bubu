import { z } from "zod";
import { DISPLAY_MODES } from "@/config/scenes";

export const memoryCreateSchema = z.object({
  title: z.string().max(200).default(""),
  caption: z.string().max(1000).default(""),
  mediaType: z.enum(["image", "video"]),
  publicId: z.string().min(1).max(300),
  date: z.string().datetime().optional().nullable(),
  category: z.string().max(50).default("everyday"),
  slot: z.number().int().min(0).nullable().optional(),
  featured: z.boolean().default(false),
  visibility: z.enum(["public", "hidden"]).default("public"),
  placement: z.enum(["story", "archive"]).default("archive"),
  objectPosition: z.string().max(50).default("center"),
  displayMode: z.enum(DISPLAY_MODES).default("inline"),
});

export const memoryUpdateSchema = memoryCreateSchema
  .extend({
    mediaType: z.enum(["image", "video"]).optional(),
    publicId: z.string().min(1).max(300).optional(),
  })
  .partial();
