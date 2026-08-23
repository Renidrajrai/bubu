"use client";

import { useRef, useState } from "react";
import { CATEGORIES, DISPLAY_MODES, STORY_SCENES } from "@/config/scenes";
import { inputCls, labelCls } from "./formCls";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

type Phase = "idle" | "signing" | "uploading" | "saving" | "error";

export default function UploadMemory({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [featureInStory, setFeatureInStory] = useState(false);
  const [sceneSlug, setSceneSlug] = useState(STORY_SCENES[0].slug);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    const isImage = IMAGE_TYPES.includes(f.type);
    const isVideo = VIDEO_TYPES.includes(f.type);
    if (!isImage && !isVideo) {
      setErrorMsg("only jpg / png / webp images or mp4 / webm / mov videos");
      return;
    }
    if (isImage && f.size > MAX_IMAGE_BYTES) {
      setErrorMsg("images up to 20 MB please");
      return;
    }
    if (isVideo && f.size > MAX_VIDEO_BYTES) {
      setErrorMsg("videos up to 100 MB please");
      return;
    }
    setErrorMsg("");
    setPhase("idle");
    setProgress(0);
    setFile(f);
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || phase === "signing" || phase === "uploading" || phase === "saving") return;
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const mediaType = VIDEO_TYPES.includes(file.type) ? "video" : "image";

    try {
      // 1. signature (server dictates folder + formats)
      setPhase("signing");
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType }),
      });
      if (!signRes.ok) throw new Error("could not start upload");
      const signed = await signRes.json();

      // 2. direct upload to Cloudinary with progress
      setPhase("uploading");
      const cloudinaryResult = await new Promise<{
        public_id: string;
        secure_url: string;
        width?: number;
        height?: number;
        format?: string;
        bytes?: number;
        duration?: number;
      }>((resolve, reject) => {
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

      // 3. persist asset record
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

      // 4. create the memory
      const sceneId = featureInStory ? sceneSlug : null;
      const slotId = featureInStory ? form.get("slotId") : null;
      const dateVal = form.get("date");
      const memoryRes = await fetch("/api/admin/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title") ?? "",
          caption: form.get("caption") ?? "",
          mediaType,
          publicId: cloudinaryResult.public_id,
          date: dateVal ? new Date(String(dateVal)).toISOString() : null,
          location: form.get("location") ?? "",
          category: form.get("category"),
          sceneId,
          slotId,
          featured: form.get("featured") === "on",
          visibility: form.get("publish") === "on" ? "public" : "hidden",
          displayMode: featureInStory ? form.get("displayMode") : "inline",
        }),
      });
      if (!memoryRes.ok) throw new Error("file uploaded but memory could not be created");

      onDone();
    } catch (err) {
      setPhase("error");
      setErrorMsg(err instanceof Error ? err.message : "something went wrong");
    } finally {
      xhrRef.current = null;
    }
  }

  const busy = phase === "signing" || phase === "uploading" || phase === "saving";
  const slots = STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots ?? [];
  const previewUrl = file && IMAGE_TYPES.includes(file.type) ? URL.createObjectURL(file) : null;

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragOver ? "border-deep-sage bg-sage/20" : "border-border hover:border-text-secondary/50"
        }`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="max-h-32 rounded-md object-contain" />
        ) : (
          <>
            <p className="text-sm">{file ? file.name : "drag a photo or video here"}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              or click to browse · jpg png webp mp4 webm mov
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      {phase === "uploading" && (
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-deep-sage transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right font-mono text-[10px] text-text-secondary">{progress}%</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className={labelCls}>
          title
          <input name="title" className={inputCls} />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-text-secondary sm:col-span-2">
          caption
          <input name="caption" className={inputCls} />
        </label>
        <label className={labelCls}>
          date
          <input type="date" name="date" className={inputCls} />
        </label>
        <label className={labelCls}>
          category
          <select name="category" className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          location
          <input name="location" className={inputCls} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input type="checkbox" name="publish" defaultChecked id="um-publish" className="accent-[#506454]" />
          <label htmlFor="um-publish">visible on site</label>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input type="checkbox" name="featured" id="um-featured" className="accent-[#b85c5c]" />
          <label htmlFor="um-featured">favorite</label>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="checkbox"
            id="um-story"
            checked={featureInStory}
            onChange={(e) => setFeatureInStory(e.target.checked)}
            className="accent-[#506454]"
          />
          <label htmlFor="um-story">feature in story</label>
        </span>
      </div>

      {featureInStory && (
        <div className="grid grid-cols-3 gap-3">
          <label className={labelCls}>
            scene
            <select
              value={sceneSlug}
              onChange={(e) => setSceneSlug(e.target.value)}
              className={inputCls}
            >
              {STORY_SCENES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.slug} · {s.title}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            slot
            <select name="slotId" className={inputCls}>
              {slots.map((sl) => (
                <option key={sl.id} value={sl.id}>{sl.id} ({sl.label})</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            display mode
            <select name="displayMode" defaultValue="inline" className={inputCls}>
              {DISPLAY_MODES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-warm-red">
          {errorMsg}
          {(phase === "error" && file) && (
            <button type="submit" className="ml-2 underline">retry</button>
          )}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        {phase === "uploading" && (
          <button
            type="button"
            onClick={() => xhrRef.current?.abort()}
            className="rounded-full px-3 py-1.5 text-xs text-text-secondary hover:text-warm-red"
          >
            cancel upload
          </button>
        )}
        {!busy && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPhase("idle");
              setErrorMsg("");
            }}
            className="rounded-full px-3 py-1.5 text-xs text-text-secondary"
          >
            clear
          </button>
        )}
        <button
          type="submit"
          disabled={!file || busy}
          className="rounded-full bg-deep-sage px-4 py-1.5 text-xs font-medium text-cream disabled:opacity-40"
        >
          {busy ? "working…" : "add memory"}
        </button>
      </div>
    </form>
  );
}
