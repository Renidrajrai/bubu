"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ZineSection } from "@/config/sections";

type Props = {
  section: ZineSection;
  slot: number;
  onClose: () => void;
  onDone: () => void;
};

type MemoryHit = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  mediaType: string;
  category: string;
  slot: number | null;
};

export default function AssignSectionDialog({ section, slot, onClose, onDone }: Props) {
  const [memories, setMemories] = useState<MemoryHit[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "500", mediaType: "image", sort: "newest" });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/memories?${params}`);
    if (res.ok) {
      const data = await res.json();
      setMemories(data.items);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function assign(messy: MemoryHit) {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/memories/${messy._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: section.category, slot }),
    });
    setSaving(false);
    if (res.ok) {
      await load();
      onDone();
    } else setError("could not assign — try again");
  }

  const SECTION_CATEGORIES = ["hero", "eyes", "cameraroll", "poster", "candid", "final"];

  const filtered = memories.filter(
    (m) =>
      m.mediaType === "image" &&
      !(m.category && SECTION_CATEGORIES.includes(m.category) && m.slot != null),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate/30 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-lift)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-medium">
            photo for {section.label} — slot {slot + 1}
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-text-secondary hover:text-text-primary"
          >
            cancel
          </button>
        </div>
        <p className="mb-2 text-[10px] text-text-secondary">
          {section.note}. Only photos can be placed here — videos live in the
          videos section.
        </p>

        <input
          ref={inputRef}
          type="text"
          placeholder="search memories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 focus:border-text-secondary"
        />

        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <p className="py-4 text-center text-xs text-text-secondary">searching…</p>
          ) : filtered.length === 0 ? (
            <p className="py-4 text-center text-xs text-text-secondary">
              no photos found
            </p>
          ) : (
            filtered.map((m) => (
              <button
                key={m._id}
                onClick={() => assign(m)}
                disabled={saving}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-muted/50 disabled:opacity-40"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-surface-muted">
                  {m.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{m.title || "(untitled)"}</p>
                  <p className="truncate text-[10px] text-text-secondary">
                    {m.category || "everyday"}
                    {m.slot != null && m.slot !== slot ? ` · slot ${m.slot + 1}` : ""}
                  </p>
                </div>
                {m.slot === slot && m.category === section.category && (
                  <span className="shrink-0 rounded-full bg-surface-muted px-1.5 py-0.5 text-[9px] text-text-secondary">
                    here
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {error && <p className="mt-2 text-xs text-rose">{error}</p>}
      </div>
    </div>
  );
}
