"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UploadMemory from "./UploadMemory";
import MemoryEditor from "./MemoryEditor";
import type { AdminMemory } from "@/types/admin";

export type { AdminMemory };

export default function MemoriesDashboard({ memories }: { memories: AdminMemory[] }) {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<AdminMemory | null>(null);
  const [deleting, setDeleting] = useState<AdminMemory | null>(null);

  async function toggleVisibility(m: AdminMemory) {
    const next = m.visibility === "public" ? "hidden" : "public";
    await fetch(`/api/admin/memories/${m._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleting) return;
    await fetch(`/api/admin/memories/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">memories</h1>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="rounded-full bg-deep-sage px-4 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-90"
        >
          {showUpload ? "close" : "+ add memory"}
        </button>
      </div>

      {showUpload && (
        <UploadMemory
          onDone={() => {
            setShowUpload(false);
            router.refresh();
          }}
        />
      )}

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {memories.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-text-secondary">
            no memories yet — upload the first one.
          </p>
        )}
        {memories.map((m) => (
          <div key={String(m._id)} className="flex items-center gap-3 px-3 py-2.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              {m.thumbnailUrl ? (
                <Image src={m.thumbnailUrl} alt="" fill sizes="48px" className="object-cover" unoptimized />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{m.title || "(untitled)"}</p>
              <p className="truncate text-xs text-text-secondary">
                {m.mediaType} · {m.category}
                {m.sceneId && ` · ${m.sceneId}${m.slotId ? ` / ${m.slotId}` : ""}`}
              </p>
            </div>
            {m.featured && <span title="featured" className="text-xs text-warm-red">★</span>}
            <button
              onClick={() => toggleVisibility(m)}
              className={`rounded-full px-2.5 py-1 text-xs ${
                m.visibility === "public"
                  ? "bg-sage/40 text-deep-sage"
                  : "bg-surface-muted text-text-secondary"
              }`}
            >
              {m.visibility}
            </button>
            <button
              onClick={() => setEditing(m)}
              className="rounded-full px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary"
            >
              edit
            </button>
            <button
              onClick={() => setDeleting(m)}
              className="rounded-full px-2.5 py-1 text-xs text-text-secondary hover:text-warm-red"
            >
              delete
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <MemoryEditor
          memory={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="flex max-w-sm flex-col gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-soft)]">
            <p className="text-sm">
              delete “{deleting.title || "(untitled)"}”? this also removes the media from Cloudinary.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleting(null)} className="rounded-full px-3 py-1.5 text-xs text-text-secondary">
                keep it
              </button>
              <button onClick={confirmDelete} className="rounded-full bg-warm-red px-3 py-1.5 text-xs text-cream">
                delete forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
