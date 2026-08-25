"use client";

import { useState } from "react";
import { CATEGORIES, DISPLAY_MODES, STORY_SCENES } from "@/config/scenes";
import { inputCls, labelCls } from "../formCls";

type Props = {
  onSubmit: (data: {
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
  }) => void;
  busy: boolean;
};

export default function MemoryMetadataForm({ onSubmit, busy }: Props) {
  const [addToStory, setAddToStory] = useState(false);
  const [sceneSlug, setSceneSlug] = useState(STORY_SCENES[0].slug);
  const slots = STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots ?? [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      title: (form.get("title") as string) ?? "",
      caption: (form.get("caption") as string) ?? "",
      date: (form.get("date") as string) ?? "",
      location: (form.get("location") as string) ?? "",
      category: (form.get("category") as string) ?? "everyday",
      visibility: form.get("publish") === "on" ? "public" : "hidden",
      featured: form.get("featured") === "on",
      addToStory,
      sceneSlug,
      slotId: (form.get("slotId") as string) ?? "",
      displayMode: (form.get("displayMode") as string) ?? "inline",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input type="checkbox" name="publish" defaultChecked id="um-publish" className="accent-[var(--cocoa)]" />
          <label htmlFor="um-publish">visible on site</label>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input type="checkbox" name="featured" id="um-featured" className="accent-[var(--cocoa)]" />
          <label htmlFor="um-featured">favorite</label>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="checkbox"
            id="um-story"
            checked={addToStory}
            onChange={(e) => setAddToStory(e.target.checked)}
            className="accent-[var(--cocoa)]"
          />
          <label htmlFor="um-story">add to story</label>
        </span>
      </div>

      {addToStory && (
        <div className="grid grid-cols-3 gap-3">
          <label className={labelCls}>
            scene
            <select value={sceneSlug} onChange={(e) => setSceneSlug(e.target.value)} className={inputCls}>
              {STORY_SCENES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            slot
            <select name="slotId" className={inputCls}>
              {slots.map((sl) => (
                <option key={sl.id} value={sl.id}>{sl.label}</option>
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

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-deep-sage px-4 py-1.5 text-xs font-medium text-cream disabled:opacity-40"
        >
          {busy ? "uploading…" : "upload memory"}
        </button>
      </div>
    </form>
  );
}
