import { z } from "zod";

export const mediaTypeSchema = z.enum(["image", "video"]);

export const signRequestSchema = z.object({
  mediaType: mediaTypeSchema,
});

export const saveAssetSchema = z.object({
  publicId: z.string().min(1).max(300),
  secureUrl: z.string().url().max(2048),
  mediaType: mediaTypeSchema,
  width: z.number().int().nonnegative().optional(),
  height: z.number().int().nonnegative().optional(),
  format: z.string().max(20).optional(),
  bytes: z.number().int().nonnegative().optional(),
  duration: z.number().nonnegative().optional(),
});
