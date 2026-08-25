"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminMediaAsset, AdminMemory } from "@/types/admin";
import ConfirmDialog from "../ConfirmDialog";
import MediaDetail from "./MediaDetail";

type Props = {
  initialAssets: (AdminMediaAsset & { isOrphan: boolean })[];
  usedPublicIds: string[];
};

type Filter = "all" | "images" | "videos" | "used" | "orphan";

export default function MediaLibrary({ initialAssets, usedPublicIds }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminMediaAsset & { isOrphan: boolean } | null>(null);
  const [deleting, setDeleting] = useState<(AdminMediaAsset & { isOrphan: boolean }) | null>(null);

  const filtered = assets.filter((a) => {
    if (filter === "images" && a.mediaType !== "image") return false;
    if (filter === "videos" && a.mediaType !== "video") return false;
    if (filter === "used" && a.isOrphan) return false;
    if (filter === "orphan" && !a.isOrphan) return false;
    if (search && !a.publicId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const orphanCount = assets.filter((a) => a.isOrphan).length;

  const doDelete = useCallback(async () => {
    if (!deleting) return;
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: deleting.publicId }),
    });
    setAssets((prev) => prev.filter((a) => a.publicId !== deleting.publicId));
    setDeleting(null);
    setSelected(null);
  }, [deleting]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">media library</h1>
        {orphanCount > 0 && (
          <span className="rounded-full bg-warm-red/10 px-2.5 py-1 text-[10px] text-warm-red">
            {orphanCount} orphan{orphanCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="search by public ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 focus:border-text-secondary"
      />

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {(["all", "images", "videos", "used", "orphan"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-2.5 py-1 text-[10px] transition-colors ${
              filter === f
                ? "bg-deep-sage text-cream"
                : "bg-surface-muted text-text-secondary hover:text-text-primary"
            }`}
          >
            {f}
            {f === "orphan" && orphanCount > 0 && ` (${orphanCount})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-sm text-text-secondary">
          no media found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {filtered.map((a) => (
            <button
              key={a.publicId}
              onClick={() => setSelected(a)}
              className="group overflow-hidden rounded-lg border border-border bg-surface text-left transition-colors hover:border-text-secondary/30"
            >
              <div className="relative aspect-[4/3] bg-surface-muted">
                {a.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                )}
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                  {a.mediaType}
                </span>
                {a.isOrphan && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-warm-red px-2 py-0.5 text-[10px] text-white">
                    orphan
                  </span>
                )}
              </div>
              <div className="truncate px-2 py-1.5 font-mono text-[10px] text-text-secondary">
                {a.publicId}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <MediaDetail
          asset={selected}
          linkedMemory={null}
          onClose={() => setSelected(null)}
          onDelete={selected.isOrphan ? () => { setDeleting(selected); } : undefined}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete media asset?"
          description={`This will permanently delete "${deleting.publicId}" from Cloudinary. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
