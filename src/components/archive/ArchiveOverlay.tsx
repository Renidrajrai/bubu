"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import Polaroid from "../media/Polaroid";
import { DEMO_VIDEO } from "../scenes/placeholders";
import { FlowerDoodle, Butterfly } from "@/assets/decorative";
import Stamp from "../scrapbook/Stamp";
import type { PublicMemory } from "@/lib/story-data";

const FILTERS = ["all", "photos", "videos", "favorites"] as const;
type Filter = (typeof FILTERS)[number];

export default function ArchiveOverlay({
  open,
  onClose,
  memories,
}: {
  open: boolean;
  onClose: () => void;
  memories: PublicMemory[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (filter === "photos") return memories.filter((m) => m.mediaType === "image");
    if (filter === "videos") return memories.filter((m) => m.mediaType === "video");
    if (filter === "favorites") return memories.filter((m) => m.title.includes("favorite"));
    return memories;
  }, [filter, memories]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-cocoa/40 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="every memory"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="mx-auto w-full max-w-4xl rounded-2xl bg-cloud p-5 shadow-lift sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-cocoa">
                the garden of us
              </h3>
              <button
                onClick={onClose}
                aria-label="close archive"
                className="min-h-[44px] rounded-full bg-blush px-3 py-1.5 font-display text-xs uppercase tracking-wide text-cocoa transition-transform hover:scale-105 active:scale-95"
              >
                close
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 font-display text-xs uppercase tracking-wide transition-all ${
                    filter === f
                      ? "bg-cocoa text-cloud"
                      : "bg-blush/50 text-cocoa hover:bg-blush"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute right-8 top-16 opacity-20">
              <Butterfly size={40} />
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <svg viewBox="0 0 40 60" className="h-16 w-10 opacity-30">
                  <ellipse cx="20" cy="16" rx="6" ry="8" fill="var(--blush-2)" />
                  <path d="M20 24 C 20 36, 20 44, 20 58" stroke="var(--cocoa-soft)" strokeWidth="1.5" fill="none" />
                </svg>
                <p className="font-hand text-xl text-cocoa-soft">no memories yet — plant the first seed.</p>
              </div>
            ) : (
              <div className="columns-2 gap-4 sm:columns-3">
                {filtered.map((mem, i) => (
                  <motion.figure
                    key={mem.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.45 }}
                    className="mb-4 break-inside-avoid"
                  >
                    {mem.mediaType === "video" ? (
                      <div className="relative rounded-md bg-cloud p-2.5 pb-3 shadow-soft">
                        <span className="absolute right-4 top-4 z-10 rounded-full bg-cocoa/55 px-2 py-0.5 font-display text-[10px] uppercase text-cloud">
                          video
                        </span>
                        <video
                          className="aspect-video w-full rounded-sm object-cover"
                          src={mem.mediaUrl}
                          poster={mem.thumbnailUrl || undefined}
                          controls
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                        <figcaption className="mt-2 text-center font-hand text-lg leading-tight text-cocoa">
                          {mem.caption || mem.title}
                        </figcaption>
                      </div>
                    ) : (
                      <>
                        <Polaroid
                          src={mem.mediaUrl}
                          alt={mem.title || mem.caption || "memory"}
                          aspectRatio={i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4"}
                          caption={mem.caption || mem.title}
                          stamp={mem.date ? new Date(mem.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined}
                          paperVariant={i % 4 === 0 ? "scrapbook" : undefined}
                          tape={i % 3 === 0}
                        />
                      </>
                    )}
                  </motion.figure>
                ))}

                <motion.figure
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * filtered.length, duration: 0.45 }}
                  className="mb-4 flex justify-center break-inside-avoid"
                >
                  <FlowerDoodle size={32} className="opacity-30" />
                </motion.figure>
              </div>
            )}

            <p className="mt-2 text-center font-hand text-xl text-cocoa-soft">
              updated whenever something new makes the cut.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
