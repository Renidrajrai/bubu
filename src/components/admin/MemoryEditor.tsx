"use client";

import { useCallback, useEffect, useState } from "react";
import { CATEGORIES, DISPLAY_MODES, STORY_SCENES } from "@/config/scenes";
import type { AdminMemory } from "@/types/admin";
import { inputCls, labelCls } from "./formCls";
import ConfirmDialog from "./ConfirmDialog";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function MemoryEditor({
  memory,
  onClose,
  onSaved,
}: {
  memory: AdminMemory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dirty, setDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const initialScene = STORY_SCENES.find((s) => s.slug === memory.sceneId)?.slug ?? "";
  const [sceneSlug, setSceneSlug] = useState(initialScene);
  const slots = STORY_SCENES.find((s) => s.slug === sceneSlug)?.slots ?? [];

  const markDirty = useCallback(() => setDirty(true), []);

  function handleClose() {
    if (dirty) {
      setShowDiscard(true);
    } else {
      onClose();
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving("saving");
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
      setSaving("error");
      return;
    }
    setDirty(false);
    setSaving("saved");
    setTimeout(() => onSaved(), 600);
  }

  const dateStr = memory.date ? new Date(memory.date).toISOString().slice(0, 10) : "";

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  const scene = STORY_SCENES.find((s) => s.slug === sceneSlug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={handleSave}
        onChange={markDirty}
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-lift)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">edit memory</h2>
          <span className="text-[10px]">
            {saving === "saving" && <span className="text-text-secondary">saving…</span>}
            {saving === "saved" && <span className="text-deep-sage">saved ✓</span>}
            {saving === "error" && <span className="text-warm-red">error</span>}
          </span>
        </div>

        {/* Media preview */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-muted">
          {memory.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={memory.thumbnailUrl} alt="" className="h-full w-full object-cover" style={{ objectPosition: memory.objectPosition ?? "center" }} />
          )}
          <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
            {memory.mediaType}
          </span>
        </div>

        {/* Section: Memory information */}
        <fieldset className="space-y-2">
          <legend className="text-[10px] font-medium uppercase tracking-widest text-text-secondary/60">memory info</legend>
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
          </div>
        </fieldset>

        {/* Section: Story placement */}
        <fieldset className="space-y-2">
          <legend className="text-[10px] font-medium uppercase tracking-widest text-text-secondary/60">story placement</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelCls}>
              scene
              <select
                value={sceneSlug}
                onChange={(e) => setSceneSlug(e.target.value)}
                className={inputCls}
              >
                <option value="">— archive only —</option>
                {STORY_SCENES.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
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
                  <option key={sl.id} value={sl.id}>{sl.label} ({sl.aspectRatio})</option>
                ))}
              </select>
            </label>
          </div>
          {scene && (
            <p className="text-[10px] text-text-secondary">
              {scene.title} — {scene.slots.length} slot{scene.slots.length !== 1 ? "s" : ""} defined
            </p>
          )}
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" name="featured" defaultChecked={memory.featured} id="me-featured" className="accent-[var(--cocoa)]" />
            <label htmlFor="me-featured">favorite</label>
          </span>
        </fieldset>

        {/* Section: Display */}
        <fieldset className="space-y-2">
          <legend className="text-[10px] font-medium uppercase tracking-widest text-text-secondary/60">display</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelCls}>
              display mode
              <select name="displayMode" defaultValue={memory.displayMode ?? "inline"} className={inputCls}>
                {DISPLAY_MODES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className={labelCls}>
              crop position
              <input name="objectPosition" defaultValue={memory.objectPosition ?? "center"} placeholder="center / top / 30% center" className={inputCls} />
            </label>
          </div>
        </fieldset>

        {/* Section: Visibility */}
        <fieldset className="space-y-2">
          <legend className="text-[10px] font-medium uppercase tracking-widest text-text-secondary/60">visibility</legend>
          <label className={labelCls}>
            <select name="visibility" defaultValue={memory.visibility} className={inputCls}>
              <option value="public">public</option>
              <option value="hidden">hidden</option>
            </select>
          </label>
        </fieldset>

        {errorMsg && <p className="text-xs text-warm-red">{errorMsg}</p>}

        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <button type="button" onClick={handleClose} className="rounded-full px-3 py-1.5 text-xs text-text-secondary">
            cancel
          </button>
          <button
            type="submit"
            disabled={saving === "saving"}
            className="rounded-full bg-deep-sage px-4 py-1.5 text-xs font-medium text-cream disabled:opacity-40"
          >
            {saving === "saving" ? "saving…" : "save"}
          </button>
        </div>
      </form>

      {showDiscard && (
        <ConfirmDialog
          title="Unsaved changes"
          description="You have unsaved changes. Discard them?"
          confirmLabel="Discard"
          cancelLabel="Keep editing"
          danger
          onConfirm={() => { setShowDiscard(false); onClose(); }}
          onCancel={() => setShowDiscard(false)}
        />
      )}
    </div>
  );
}
