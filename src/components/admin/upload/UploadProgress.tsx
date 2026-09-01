"use client";

export default function UploadProgress({ progress }: { progress: number }) {
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-cocoa transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[10px] text-text-secondary">{progress}%</p>
    </div>
  );
}
