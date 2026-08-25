"use client";

import { useRef, useState } from "react";
import FileDropzone from "./upload/FileDropzone";
import UploadProgress from "./upload/UploadProgress";
import MemoryMetadataForm from "./upload/MemoryMetadataForm";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

type Phase = "idle" | "signing" | "uploading" | "saving" | "success" | "error" | "cancelled";

function humanError(msg: string): string {
  if (msg === "cancelled") return "Upload cancelled.";
  if (msg.includes("network")) return "Network error during upload. Please check your connection and try again.";
  if (msg.includes("could not start")) return "Could not prepare the upload. Please try again.";
  if (msg.includes("upload failed")) return "The upload to Cloudinary failed. Please try again.";
  if (msg.includes("could not save")) return "The file was uploaded but could not be saved. The uploaded file may be cleaned up automatically.";
  if (msg.includes("memory could not be created")) return "The file was uploaded but the memory could not be created. The uploaded file has been cleaned up.";
  return msg;
}

export default function UploadMemory({ onDone }: { onDone: () => void }) {
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const busy = phase === "signing" || phase === "uploading" || phase === "saving";
  const previewUrl = file && IMAGE_TYPES.includes(file.type) ? URL.createObjectURL(file) : null;

  function pickFile(f: File) {
    const isImage = IMAGE_TYPES.includes(f.type);
    const isVideo = VIDEO_TYPES.includes(f.type);
    if (!isImage && !isVideo) {
      setErrorMsg("Only JPG, PNG, WebP images or MP4, WebM, MOV videos are supported.");
      return;
    }
    if (isImage && f.size > MAX_IMAGE_BYTES) {
      setErrorMsg("Image too large. Maximum size is 20 MB.");
      return;
    }
    if (isVideo && f.size > MAX_VIDEO_BYTES) {
      setErrorMsg("Video too large. Maximum size is 100 MB.");
      return;
    }
    setErrorMsg("");
    setPhase("idle");
    setProgress(0);
    setFile(f);
  }

  async function cleanupCloudinary(publicId: string, mediaType: string) {
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    } catch {
      // best-effort cleanup
    }
  }

  async function handleUpload(metadata: {
    title: string;
    caption: string;
    date: string;
    location: string;
    category: string;
    visibility: "public" | "hidden";
    featured: boolean;
    addToStory: boolean;
    sceneSlug: string;
    slotId: string;
    displayMode: string;
  }) {
    if (!file || busy) return;
    setErrorMsg("");

    let cloudinaryResult: { public_id: string; secure_url: string; width?: number; height?: number; format?: string; bytes?: number; duration?: number } | undefined;

    try {
      // 1. Signature
      const mediaType = VIDEO_TYPES.includes(file.type) ? "video" : "image";
      setPhase("signing");
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType }),
      });
      if (!signRes.ok) throw new Error("could not start upload");
      const signed = await signRes.json();

      // 2. Direct upload to Cloudinary
      setPhase("uploading");
      cloudinaryResult = await new Promise((resolve, reject) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", signed.apiKey);
        fd.append("timestamp", String(signed.timestamp));
        fd.append("folder", signed.folder);
        fd.append("allowed_formats", signed.allowed_formats);
        fd.append("signature", signed.signature);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && res.public_id) resolve(res);
            else reject(new Error(res?.error?.message ?? "upload failed"));
          } catch {
            reject(new Error("upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("network error during upload"));
        xhr.onabort = () => reject(new Error("cancelled"));
        xhr.send(fd);
      });

      if (!cloudinaryResult) throw new Error("upload failed");

      // 3. Persist asset record
      setPhase("saving");
      const assetRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: cloudinaryResult.public_id,
          secureUrl: cloudinaryResult.secure_url,
          mediaType,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
          duration: cloudinaryResult.duration,
        }),
      });
      if (!assetRes.ok) throw new Error("could not save the uploaded file");

      // 4. Create memory
      const sceneId = metadata.addToStory ? metadata.sceneSlug : null;
      const slotId = metadata.addToStory ? metadata.slotId : null;
      const memoryRes = await fetch("/api/admin/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: metadata.title,
          caption: metadata.caption,
          mediaType,
          publicId: cloudinaryResult.public_id,
          date: metadata.date ? new Date(metadata.date).toISOString() : null,
          location: metadata.location,
          category: metadata.category,
          sceneId,
          slotId,
          featured: metadata.featured,
          visibility: metadata.visibility,
          displayMode: metadata.addToStory ? metadata.displayMode : "inline",
        }),
      });
      if (!memoryRes.ok) {
        // Recovery: clean up the Cloudinary asset since memory creation failed
        if (cloudinaryResult) await cleanupCloudinary(cloudinaryResult.public_id, mediaType);
        throw new Error("file uploaded but memory could not be created. The uploaded file has been cleaned up.");
      }

      setPhase("success");
      setTimeout(() => onDone(), 500);
    } catch (err) {
      setPhase("error");
      setErrorMsg(humanError(err instanceof Error ? err.message : "something went wrong"));
    } finally {
      xhrRef.current = null;
    }
  }

  function handleCancel() {
    xhrRef.current?.abort();
    setPhase("cancelled");
    setErrorMsg("");
  }

  function handleRetry() {
    setPhase("idle");
    setErrorMsg("");
    setProgress(0);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
      <FileDropzone file={file} previewUrl={previewUrl} onFile={pickFile} />

      {phase === "uploading" && <UploadProgress progress={progress} />}

      {file && phase !== "success" && (
        <MemoryMetadataForm onSubmit={handleUpload} busy={busy} />
      )}

      {phase === "success" && (
        <p className="text-center text-sm text-deep-sage">uploaded ✓</p>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg bg-warm-red/10 px-3 py-2">
          <p className="flex-1 text-xs text-warm-red">{errorMsg}</p>
          {phase === "error" && (
            <button onClick={handleRetry} className="shrink-0 text-xs font-medium text-warm-red underline">
              retry
            </button>
          )}
        </div>
      )}

      {phase === "cancelled" && (
        <p className="text-center text-xs text-text-secondary">upload cancelled</p>
      )}

      <div className="flex justify-end gap-2">
        {phase === "uploading" && (
          <button onClick={handleCancel} className="rounded-full px-3 py-1.5 text-xs text-text-secondary hover:text-warm-red">
            cancel upload
          </button>
        )}
        {file && !busy && phase !== "success" && (
          <button
            onClick={() => { setFile(null); setPhase("idle"); setErrorMsg(""); }}
            className="rounded-full px-3 py-1.5 text-xs text-text-secondary"
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
}
