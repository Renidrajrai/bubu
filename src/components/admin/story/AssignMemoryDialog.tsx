"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminMemory } from "@/types/admin";
import ConfirmDialog from "../ConfirmDialog";

type Props = {
  sceneSlug: string;
  slotId: string;
  existing?: { _id: string; title: string };
  onClose: () => void;
  onDone: () => void;
};

export default function AssignMemoryDialog({ sceneSlug, slotId, existing, onClose, onDone }: Props) {
  const [memories, setMemories] = useState<AdminMemory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [confirmReplace, setConfirmReplace] = useState<AdminMemory | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({ limit: "50", sort: "newest" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/memories?${params}`);
      if (res.ok && !cancelled) {
        const data = await res.json();
        setMemories(data.items);
      }
      if (!cancelled) setLoading(false);
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [search]);

  async function doAssign(memory: AdminMemory) {
    setAssigning(true);
    setError("");
    const res = await fetch("/api/admin/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoryId: memory._id, sceneSlug, slotId }),
    });
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      if (res.status === 409 && data.occupiedBy) {
        // Slot occupied — ask to replace
        setConfirmReplace({ ...memory, _id: data.occupiedBy._id, title: data.occupiedBy.title } as AdminMemory);
        setAssigning(false);
      } else {
        setError(data.error || "Failed to assign");
        setAssigning(false);
      }
    }
  }

  async function forceAssign(memory: AdminMemory) {
    // Remove existing, then assign
    if (confirmReplace) {
      await fetch("/api/admin/stories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryId: confirmReplace._id }),
      });
    }
    setConfirmReplace(null);
    await doAssign(memory);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-lift)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">
            assign to {sceneSlug} / {slotId}
          </h2>
          <button onClick={onClose} className="text-xs text-text-secondary hover:text-text-primary">cancel</button>
        </div>

        {existing && (
          <p className="mb-2 text-[10px] text-text-secondary">
            currently: {existing.title || "(untitled)"}
          </p>
        )}

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
          ) : memories.length === 0 ? (
            <p className="py-4 text-center text-xs text-text-secondary">no memories found</p>
          ) : (
            memories.map((m) => (
              <button
                key={m._id}
                onClick={() => doAssign(m)}
                disabled={assigning}
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
                  <p className="truncate text-[10px] text-text-secondary">{m.mediaType} · {m.category}</p>
                </div>
                {m.sceneId && (
                  <span className="shrink-0 rounded-full bg-surface-muted px-1.5 py-0.5 text-[9px] text-text-secondary">
                    in story
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {error && <p className="mt-2 text-xs text-warm-red">{error}</p>}
      </div>

      {confirmReplace && (
        <ConfirmDialog
          title={`Replace "${confirmReplace.title || "(untitled)"}"?`}
          description="This slot already contains a memory. Replace it?"
          confirmLabel="Replace"
          onConfirm={() => forceAssign(confirmReplace)}
          onCancel={() => { setConfirmReplace(null); onClose(); }}
        />
      )}
    </div>
  );
}
