"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import Polaroid from "../media/Polaroid";
import { DEMO_VIDEO, ph } from "../scenes/placeholders";
import { FlowerDoodle, Butterfly } from "@/assets/decorative";
import Stamp from "../scrapbook/Stamp";

// §37–§38: Archive as a living library — memories scattered as paper cards
// on a garden surface. Editorial masonry, filters, paper texture, botanical accents.

const ITEMS = [
  { seed: "pattu-01", caption: "where it started", stamp: "est. 2025", type: "photo" as const },
  { seed: "pattu-02", caption: "golden hour walk", stamp: "06 · 14 · 2025", type: "photo" as const },
  { seed: "pattu-03", caption: "your terrible coffee order", stamp: "07 · 02 · 2025", type: "photo" as const },
  { seed: "pattu-05", caption: "cluster left", stamp: "", type: "photo" as const },
  { seed: "pattu-06", caption: "two of us, one frame", stamp: "08 · 01 · 2025", type: "photo" as const },
  { seed: "pattu-04", caption: "road trip, day one", stamp: "", type: "photo" as const },
  { seed: "pattu-07", caption: "soft morning light", stamp: "", type: "photo" as const },
  { seed: "pattu-08", caption: "golden hour, always", stamp: "09 · 21 · 2026", type: "photo" as const },
  { seed: "video-01", caption: "silly video evidence", stamp: "", type: "video" as const },
];

const FILTERS = ["all", "photos", "videos", "favorites"] as const;
type Filter = (typeof FILTERS)[number];

export default function ArchiveOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
    if (filter === "photos") return ITEMS.filter((i) => i.type === "photo");
    if (filter === "videos") return ITEMS.filter((i) => i.type === "video");
    if (filter === "favorites") return ITEMS.filter((i) => i.seed === "pattu-01" || i.seed === "pattu-06");
    return ITEMS;
  }, [filter]);

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
          aria-label="every photo"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="mx-auto w-full max-w-4xl rounded-2xl bg-cloud p-5 shadow-lift sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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

            {/* Filter chips */}
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

            {/* Botanical accent */}
            <div className="pointer-events-none absolute right-8 top-16 opacity-20">
              <Butterfly size={40} />
            </div>

            {/* Masonry grid — editorial layout */}
            <div className="columns-2 gap-4 sm:columns-3">
              {filtered.map((item, i) => (
                <motion.figure
                  key={item.seed}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.45 }}
                  className="mb-4 break-inside-avoid"
                >
                  {item.type === "video" ? (
                    <div className="relative rounded-md bg-cloud p-2.5 pb-3 shadow-soft">
                      <span className="absolute right-4 top-4 z-10 rounded-full bg-cocoa/55 px-2 py-0.5 font-display text-[10px] uppercase text-cloud">
                        video
                      </span>
                      <video
                        className="aspect-video w-full rounded-sm object-cover"
                        src={DEMO_VIDEO}
                        poster={ph("pattu-video", 800, 450)}
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                      <figcaption className="mt-2 text-center font-hand text-lg leading-tight text-cocoa">
                        {item.caption}
                      </figcaption>
                    </div>
                  ) : (
                    <>
                      <Polaroid
                        src={ph(item.seed, 500, 620)}
                        alt={item.caption}
                        aspectRatio={i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4"}
                        caption={item.caption}
                        stamp={item.stamp || undefined}
                        paperVariant={i % 4 === 0 ? "scrapbook" : undefined}
                        tape={i % 3 === 0}
                      />
                      {item.stamp && (
                        <div className="mt-1">
                          <Stamp text={item.stamp} variant="date" />
                        </div>
                      )}
                    </>
                  )}
                </motion.figure>
              ))}

              {/* Decorative flower at the end */}
              <motion.figure
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * filtered.length, duration: 0.45 }}
                className="mb-4 flex justify-center break-inside-avoid"
              >
                <FlowerDoodle size={32} className="opacity-30" />
              </motion.figure>
            </div>

            <p className="mt-2 text-center font-hand text-xl text-cocoa-soft">
              updated whenever something new makes the cut.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
