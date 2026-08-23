"use client";

import { useState } from "react";
import { CATEGORIES, DISPLAY_MODES, STORY_SCENES } from "@/config/scenes";
import type { AdminMemory } from "./MemoriesDashboard";
import { inputCls, labelCls } from "./formCls";

export default function MemoryEditor({
  memory,
  onClose,
  onSaved,
}: {
  memory: AdminMemory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const initialScene =
    STORY_SCENES.find((s) => s.slug === memory.sceneId)?.slug ?? "";
  const [sceneSlug, setSceneSlug] = useState(initialScene);
  const slots = STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots ?? [];

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const sceneId = (form.get("sceneId") as string) || null;
    const dateVal = form.get("date");

    const res = await fetch(`/api/admin/memories/${memory._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        caption: form.get("caption"),
        location: form.get("location"),
        category: form.get("category"),
        featured: form.get("featured") === "on",
        visibility: form.get("visibility"),
        displayMode: form.get("displayMode"),
        objectPosition: form.get("objectPosition"),
        sceneId,
        slotId: sceneId ? form.get("slotId") : null,
        date: dateVal ? new Date(String(dateVal)).toISOString() : null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "could not save");
      setSaving(false);
      return;
    }
    onSaved();
  }

  const dateStr = memory.date ? new Date(memory.date).toISOString().slice(0, 10) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={handleSave}
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-soft)]"
      >
        <h2 className="text-sm font-medium">edit memory</h2>

        <label className={labelCls}>
          title
          <input name="title" defaultValue={memory.title} className={inputCls} />
        </label>
        <label className={labelCls}>
          caption
          <input name="caption" defaultValue={memory.caption} className={inputCls} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            date
            <input type="date" name="date" defaultValue={dateStr} className={inputCls} />
          </label>
          <label className={labelCls}>
            category
            <select name="category" defaultValue={memory.category} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            location
            <input name="location" defaultValue={memory.location ?? ""} className={inputCls} />
          </label>
          <label className={labelCls}>
            crop position
            <input name="objectPosition" defaultValue={memory.objectPosition ?? "center"} placeholder="center / top / 30% center" className={inputCls} />
          </label>
          <label className={labelCls}>
            display mode
            <select name="displayMode" defaultValue={memory.displayMode ?? "inline"} className={inputCls}>
              {DISPLAY_MODES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            visibility
            <select name="visibility" defaultValue={memory.visibility} className={inputCls}>
              <option value="public">public</option>
              <option value="hidden">hidden</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            story scene
            <select
              value={sceneSlug}
              onChange={(e) => setSceneSlug(e.target.value)}
              className={inputCls}
            >
              <option value="">— archive only —</option>
              {STORY_SCENES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.slug} · {s.title}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            slot
            <select
              name="slotId"
              key={sceneSlug}
              defaultValue={sceneSlug === initialScene ? (memory.slotId ?? "") : ""}
              disabled={!sceneSlug}
              className={`${inputCls} disabled:opacity-40`}
            >
              <option value="">— pick a slot —</option>
              {slots.map((sl) => (
                <option key={sl.id} value={sl.id}>{sl.id} ({sl.label})</option>
              ))}
            </select>
          </label>
        </div>

        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input type="checkbox" name="featured" defaultChecked={memory.featured} id="me-featured" className="accent-[#b85c5c]" />
          <label htmlFor="me-featured">favorite</label>
        </span>

        {errorMsg && <p className="text-xs text-warm-red">{errorMsg}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-xs text-text-secondary">
            cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-deep-sage px-4 py-1.5 text-xs font-medium text-cream disabled:opacity-40">
            {saving ? "saving…" : "save"}
          </button>
        </div>
      </form>
    </div>
  );
}
