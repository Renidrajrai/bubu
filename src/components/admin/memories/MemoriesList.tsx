"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AdminMemory, PaginatedResponse } from "@/types/admin";
import UploadMemory from "../UploadMemory";
import MemoryFilters from "./MemoryFilters";
import MemoryBulkActions from "./MemoryBulkActions";
import MemoryEditor from "../MemoryEditor";
import DeleteMemoryDialog from "./DeleteMemoryDialog";

type FilterState = {
  search: string;
  visibility: string;
  mediaType: string;
  category: string;
  featured: string;
  sort: string;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function MemoriesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    visibility: "all",
    mediaType: "all",
    category: "",
    featured: "",
    sort: "newest",
  });
  const debouncedSearch = useDebounce(filters.search, 300);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<AdminMemory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(
    () => searchParams.get("upload") === "true",
  );
  const [editing, setEditing] = useState<AdminMemory | null>(null);
  const [deleting, setDeleting] = useState<AdminMemory | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.visibility !== "all") params.set("visibility", filters.visibility);
    if (filters.mediaType !== "all") params.set("mediaType", filters.mediaType);
    if (filters.category) params.set("category", filters.category);
    if (filters.featured) params.set("featured", filters.featured);
    params.set("sort", filters.sort);
    params.set("page", String(page));
    params.set("limit", "100");

    const res = await fetch(`/api/admin/memories?${params}`);
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount: loading starts true, state updates in the async continuation
    fetchMemories();
  }, [fetchMemories]);

  // Clean the ?upload=true param once it's been read into state
  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      router.replace("/admin/memories");
    }
  }, [searchParams, router]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!data) return;
    if (selected.size === data.items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.items.map((m) => m._id)));
    }
  }

  async function handleBulkAction(action: string, payload?: Record<string, unknown>) {
    if (action === "delete") {
      setBulkDeleting(true);
      return;
    }
    const res = await fetch("/api/admin/memories/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), action, ...payload }),
    });
    if (!res.ok) return;
    setSelected(new Set());
    fetchMemories();
  }

  async function confirmBulkDelete() {
    const res = await fetch("/api/admin/memories/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), action: "delete" }),
    });
    if (!res.ok) return;
    setSelected(new Set());
    setBulkDeleting(false);
    fetchMemories();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-medium">memories</h1>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-90"
        >
          {showUpload ? "close" : "+ add memory"}
        </button>
      </div>

      {showUpload && (
        <UploadMemory
          onDone={() => {
            setShowUpload(false);
            fetchMemories();
          }}
        />
      )}

      <MemoryFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

      {selected.size > 0 && (
        <MemoryBulkActions
          count={selected.size}
          onAction={handleBulkAction}
          onCancel={() => setSelected(new Set())}
        />
      )}

      {loading ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-sm text-text-secondary">
          loading memories…
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center">
          <p className="text-sm text-text-secondary">no memories found</p>
          <a href="/admin/memories?upload=true" className="mt-2 inline-block text-xs text-cocoa hover:underline">
            + add your first memory
          </a>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="w-10 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.size === data.items.length && data.items.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-[var(--cocoa)]"
                    />
                  </th>
                  <th className="px-3 py-2" />
                  <th className="px-3 py-2">title</th>
                  <th className="px-3 py-2">type</th>
                  <th className="px-3 py-2">category</th>
                  <th className="px-3 py-2">date</th>
                  <th className="px-3 py-2">status</th>
                  <th className="w-20 px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((m) => (
                  <tr key={m._id} className="border-b border-border/50 last:border-0 hover:bg-surface-muted/30">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.has(m._id)}
                        onChange={() => toggleSelect(m._id)}
                        className="accent-[var(--cocoa)]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded bg-surface-muted">
                        {m.thumbnailUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 font-medium">{m.title || "(untitled)"}</td>
                    <td className="px-3 py-2 text-text-secondary">{m.mediaType}</td>
                    <td className="max-w-[120px] truncate px-3 py-2 text-text-secondary">
                      {m.category || "—"}
                    </td>
                    <td className="px-3 py-2 text-text-secondary">
                      {m.date ? new Date(m.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] ${
                        m.visibility === "public"
                          ? "bg-cocoa/10 text-cocoa"
                          : "bg-surface-muted text-text-secondary"
                      }`}>
                        {m.visibility}
                      </span>
                      {m.featured && <span className="ml-1 text-[10px] text-rose">★</span>}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(m)} className="rounded px-1.5 py-0.5 text-text-secondary hover:text-text-primary">
                          edit
                        </button>
                        <button onClick={() => setDeleting(m)} className="rounded px-1.5 py-0.5 text-text-secondary hover:text-rose">
                          del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-2 md:hidden">
            {data.items.map((m) => (
              <div key={m._id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={selected.has(m._id)}
                  onChange={() => toggleSelect(m._id)}
                  className="accent-[var(--cocoa)]"
                />
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-surface-muted">
                  {m.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.title || "(untitled)"}</p>
                  <p className="truncate text-[10px] text-text-secondary">
                    {m.mediaType} · {m.category || "everyday"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setEditing(m)} className="rounded px-1.5 py-0.5 text-xs text-text-secondary hover:text-text-primary">edit</button>
                  <button onClick={() => setDeleting(m)} className="rounded px-1.5 py-0.5 text-xs text-text-secondary hover:text-rose">del</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full px-2.5 py-1 text-text-secondary hover:text-text-primary disabled:opacity-30"
              >
                prev
              </button>
              <span className="text-text-secondary">
                {page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="rounded-full px-2.5 py-1 text-text-secondary hover:text-text-primary disabled:opacity-30"
              >
                next
              </button>
            </div>
          )}
        </>
      )}

      {editing && (
        <MemoryEditor
          memory={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchMemories(); }}
        />
      )}

      {deleting && (
        <DeleteMemoryDialog
          memory={deleting}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/memories/${deleting._id}`, { method: "DELETE" });
            if (!res.ok) return;
            setDeleting(null);
            fetchMemories();
          }}
          onCancel={() => setDeleting(null)}
        />
      )}

      {bulkDeleting && (
        <DeleteMemoryDialog
          memory={{ title: `${selected.size} memories`, _id: "" }}
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleting(false)}
          bulk
        />
      )}
    </div>
  );
}
