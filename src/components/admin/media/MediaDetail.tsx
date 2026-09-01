"use client";

import type { AdminMediaAsset } from "@/types/admin";

type Props = {
  asset: AdminMediaAsset & { isOrphan: boolean };
  linkedMemory: { _id: string; title: string } | null;
  onClose: () => void;
  onDelete?: () => void;
};

export default function MediaDetail({ asset, linkedMemory, onClose, onDelete }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate/30 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-lift)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-medium">media detail</h2>
          <button onClick={onClose} className="text-xs text-text-secondary hover:text-text-primary">
            close
          </button>
        </div>

        <div className="relative mb-3 overflow-hidden rounded-lg bg-surface-muted">
          {asset.mediaType === "image" && asset.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset.url} alt="" className="w-full object-contain" style={{ maxHeight: "300px" }} />
          ) : asset.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset.thumbnailUrl} alt="" className="w-full object-contain" style={{ maxHeight: "300px" }} />
          ) : (
            <div className="flex h-40 items-center justify-center text-xs text-text-secondary">
              no preview
            </div>
          )}
        </div>

        <dl className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Type</dt>
            <dd>{asset.mediaType}</dd>
          </div>
          {asset.format && (
            <div className="flex justify-between">
              <dt className="text-text-secondary">Format</dt>
              <dd>{asset.format}</dd>
            </div>
          )}
          {asset.width && asset.height && (
            <div className="flex justify-between">
              <dt className="text-text-secondary">Dimensions</dt>
              <dd>{asset.width} × {asset.height}</dd>
            </div>
          )}
          {asset.bytes && (
            <div className="flex justify-between">
              <dt className="text-text-secondary">Size</dt>
              <dd>{(asset.bytes / 1024 / 1024).toFixed(1)} MB</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-text-secondary">Public ID</dt>
            <dd className="max-w-[200px] truncate font-mono text-[10px]">{asset.publicId}</dd>
          </div>
        </dl>

        {asset.isOrphan && (
          <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-[10px] text-rose">
            This asset is not currently used by any memory.
          </p>
        )}

        {linkedMemory && (
          <p className="mt-3 text-[10px] text-text-secondary">
            Used by: <span className="font-medium text-text-primary">{linkedMemory.title || "(untitled)"}</span>
          </p>
        )}

        <div className="mt-3 flex justify-end gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-full bg-rose/10 px-3 py-1.5 text-[10px] text-rose hover:bg-rose/20"
            >
              delete orphan
            </button>
          )}
          <button onClick={onClose} className="rounded-full px-3 py-1.5 text-xs text-text-secondary">
            close
          </button>
        </div>
      </div>
    </div>
  );
}
