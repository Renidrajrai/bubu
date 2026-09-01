"use client";

type Props = {
  count: number;
  onAction: (action: string, payload?: Record<string, unknown>) => void;
  onCancel: () => void;
};

export default function MemoryBulkActions({ count, onAction, onCancel }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
      <span className="text-xs text-text-secondary">{count} selected</span>

      <button onClick={() => onAction("setVisibility", { visibility: "public" })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">make public</button>
      <button onClick={() => onAction("setVisibility", { visibility: "hidden" })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">hide</button>
      <button onClick={() => onAction("setFeatured", { featured: true })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">feature</button>
      <button onClick={() => onAction("setFeatured", { featured: false })} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary">unfeature</button>

      <button onClick={() => onAction("delete")} className="rounded-full bg-rose/10 px-2.5 py-1 text-[10px] text-rose hover:bg-rose/20">delete</button>

      <button onClick={onCancel} className="ml-auto text-[10px] text-text-secondary hover:text-text-primary">clear</button>
    </div>
  );
}
