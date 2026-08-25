"use client";

import { useRef } from "react";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPT = ".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime";

type Props = {
  file: File | null;
  previewUrl: string | null;
  onFile: (f: File) => void;
};

export default function FileDropzone({ file, previewUrl, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef(false);

  function pick(f: File | undefined | null) {
    if (!f) return;
    if (!IMAGE_TYPES.includes(f.type) && !VIDEO_TYPES.includes(f.type)) return;
    onFile(f);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); dragRef.current = true; }}
      onDragLeave={() => { dragRef.current = false; }}
      onDrop={(e) => { e.preventDefault(); dragRef.current = false; pick(e.dataTransfer.files?.[0]); }}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:border-text-secondary/50"
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
          <p className="text-[10px] text-text-secondary">max 20 MB images · 100 MB videos</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}
