"use client";

import { useCallback, useState } from "react";
import AssignSectionDialog from "./AssignSectionDialog";
import type { ZineSection } from "@/config/sections";

type SectionMemory = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  mediaType: string;
  category: string;
  visibility: string;
  featured: boolean;
};

export default function StorySections({
  sections,
}: {
  sections: (ZineSection & { memories: (SectionMemory | undefined)[] })[];
}) {
  const [assigning, setAssigning] = useState<{
    section: ZineSection;
    slot: number;
  } | null>(null);
  const [removing, setRemoving] = useState<{
    section: ZineSection;
    memory: SectionMemory;
  } | null>(null);

  const refresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-medium">story</h1>
        <span className="text-xs text-text-secondary">
          place photos into the page&apos;s sections — each section has a fixed
          number of slots
        </span>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.category}
            className="rounded-xl border border-border bg-surface p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-medium capitalize">
                  {section.label}
                </p>
                <p className="text-[10px] text-text-secondary">
                  {section.note} · {section.slots} slot
                  {section.slots !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: section.slots }, (_, slot) => {
                const m = section.memories[slot];
                return (
                  <div key={slot} className="flex flex-col items-center gap-1">
                    {m ? (
                      <div
                        className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface-muted"
                        title={m.title || "(untitled)"}
                      >
                        {m.thumbnailUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.thumbnailUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                        <span className="absolute left-1 top-1 rounded bg-black/50 px-1 text-[9px] text-white">
                          {slot + 1}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigning({ section, slot })}
                        className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border text-text-secondary hover:text-text-primary"
                        title={`add to slot ${slot + 1}`}
                      >
                        +
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      {m && (
                        <button
                          onClick={() => setAssigning({ section, slot })}
                          className="text-[9px] text-text-secondary hover:text-text-primary"
                        >
                          change
                        </button>
                      )}
                      {m && (
                        <button
                          onClick={() => setRemoving({ section, memory: m })}
                          className="text-[9px] text-rose hover:text-red-700"
                        >
                          remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {assigning && (
        <AssignSectionDialog
          section={assigning.section}
          slot={assigning.slot}
          onClose={() => setAssigning(null)}
          onDone={() => {
            setAssigning(null);
            refresh();
          }}
        />
      )}

      {removing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate/30 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-sm font-medium">remove from section?</h2>
            <p className="mt-2 text-xs text-text-secondary">
              &ldquo;{removing.memory.title || "(untitled)"}&rdquo; will be
              removed from {removing.section.label} but stays in your memories.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRemoving(null)}
                className="rounded-full px-3 py-1.5 text-xs text-text-secondary"
              >
                cancel
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/admin/memories/${removing.memory._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slot: null }),
                  });
                  setRemoving(null);
                  refresh();
                }}
                className="rounded-full bg-rose px-4 py-1.5 text-xs font-medium text-cream"
              >
                remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
