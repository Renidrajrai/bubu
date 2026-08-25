"use client";

import { useState } from "react";
import { STORY_SCENES } from "@/config/scenes";

type Props = {
  count: number;
  onAction: (action: string, payload?: Record<string, unknown>) => void;
  onCancel: () => void;
};

export default function MemoryBulkActions({ count, onAction, onCancel }: Props) {
  const [showScenePicker, setShowScenePicker] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
      <span className="text-xs text-text-secondary">{count} selected</span>

      <button onClick={() => onAction("setVisibility", { visibility: "public" })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">make public</button>
      <button onClick={() => onAction("setVisibility", { visibility: "hidden" })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">hide</button>
      <button onClick={() => onAction("setFeatured", { featured: true })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">feature</button>
      <button onClick={() => onAction("setFeatured", { featured: false })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">unfeature</button>
      <button onClick={() => onAction("setPlacement", { placement: "archive" })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">to archive</button>
      <button onClick={() => onAction("removeFromStory")} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">remove from story</button>

      <div className="relative">
        <button onClick={() => setShowScenePicker(!showScenePicker)} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">assign scene…</button>
        {showScenePicker && (
          <div className="absolute left-0 top-full z-10 mt-1 rounded-lg border border-border bg-surface p-1 shadow-[var(--shadow-soft)]">
            {STORY_SCENES.map((s) => (
              <button
                key={s.slug}
                onClick={() => { onAction("setPlacement", { placement: "story" }); setShowScenePicker(false); }}
                className="block w-full rounded px-2 py-1 text-left text-[10px] text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => onAction("delete")} className="rounded-full bg-warm-red/10 px-2.5 py-1 text-[10px] text-warm-red hover:bg-warm-red/20">delete</button>

      <button onClick={onCancel} className="ml-auto text-[10px] text-text-secondary hover:text-text-primary">clear</button>
    </div>
  );
}
