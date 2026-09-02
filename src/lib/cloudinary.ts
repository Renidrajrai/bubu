import { v2 as cloudinary } from "cloudinary";

// server-dictated upload destinations (spec §12)
export const UPLOAD_FOLDERS = {
  image: "boyfriend-site/images",
  video: "boyfriend-site/videos",
} as const;

export const ALLOWED_FORMATS = {
  image: "jpg,jpeg,png,webp",
  video: "mp4,webm,mov",
} as const;

export function requireCloudinaryEnv() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are not configured");
  }
  // idempotent; called lazily so scripts that load .env.local late still work
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function signUploadParams(params: Record<string, string | number>) {
  return cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET as string
  );
}

// Single source of truth for what an upload is allowed to do.
export function createSignedUploadParams(mediaType: "image" | "video") {
  requireCloudinaryEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: UPLOAD_FOLDERS[mediaType],
    allowed_formats: ALLOWED_FORMATS[mediaType],
    timestamp,
  };
  return {
    ...params,
    signature: signUploadParams(params),
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    resourceType: mediaType === "video" ? ("video" as const) : ("image" as const),
  };
}

export function imageThumbnailUrl(publicId: string) {
  return cloudinary.url(publicId, {
    width: 400,
    height: 400,
    crop: "fill",
    format: "jpg",
    secure: true,
  });
}

export function videoThumbnailUrl(publicId: string) {
  return cloudinary.utils.video_thumbnail_url(publicId, { secure: true }) as string;
}

export default cloudinary;
