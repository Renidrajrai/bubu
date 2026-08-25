"use client";

import type { StoryScene, StorySlot } from "@/config/scenes";

type SlotWithMemory = StorySlot & {
  memory?: {
    _id: string;
    title: string;
    thumbnailUrl: string;
    mediaType: string;
    visibility: string;
  };
};

type Props = {
  scene: StoryScene;
  slots: SlotWithMemory[];
  enabled: boolean;
  onAssign: (sceneSlug: string, slotId: string) => void;
};

export default function SceneCard({ scene, slots, enabled, onAssign }: Props) {
  return (
    <div className={`rounded-xl border bg-surface p-4 ${enabled ? "border-border" : "border-border/50 opacity-60"}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium capitalize">{scene.title}</h3>
        {!enabled && (
          <span className="text-[10px] uppercase tracking-widest text-warm-red">disabled</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {slots.map((sl) => (
          <div key={sl.id} className="flex flex-col gap-1">
            <button
              onClick={() => onAssign(scene.slug, sl.id)}
              className="group relative w-28 overflow-hidden rounded-lg border border-border bg-surface-muted transition-colors hover:border-text-secondary/30"
              style={{ aspectRatio: sl.aspectRatio }}
            >
              {sl.memory?.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sl.memory.thumbnailUrl}
                  alt={sl.memory.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-text-secondary">
                  ○ empty
                </span>
              )}
              {sl.memory && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {sl.memory.title || "untitled"}
                </span>
              )}
            </button>
            <span className="max-w-28 truncate text-center text-[10px] text-text-secondary">
              {sl.label}
              {sl.memory && ` · ✓`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
