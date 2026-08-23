"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import Polaroid from "../media/Polaroid";
import { DEMO_VIDEO, ph } from "../scenes/placeholders";

const ITEMS = [
  { seed: "pattu-01", caption: "where it started", stamp: "est. 2025" },
  { seed: "pattu-02", caption: "golden hour walk", stamp: "06 · 14 · 2025" },
  { seed: "pattu-03", caption: "your terrible coffee order", stamp: "07 · 02 · 2025" },
  { seed: "pattu-05", caption: "cluster left", stamp: "" },
  { seed: "pattu-06", caption: "two of us, one frame", stamp: "08 · 01 · 2025" },
  { seed: "pattu-04", caption: "road trip, day one", stamp: "" },
  { seed: "pattu-07", caption: "soft morning light", stamp: "" },
  { seed: "pattu-08", caption: "golden hour, always", stamp: "09 · 21 · 2026" },
];

export default function ArchiveOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-cocoa">
                every photo 🐾
              </h3>
              <button
                onClick={onClose}
                aria-label="close archive"
                className="rounded-full bg-blush px-3 py-1.5 font-display text-xs uppercase tracking-wide text-cocoa transition-transform hover:scale-105 active:scale-95"
              >
                close
              </button>
            </div>

            <div className="columns-2 gap-4 sm:columns-3">
              {ITEMS.map((item, i) => (
                <motion.figure
                  key={item.seed}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.45 }}
                  className="mb-4 break-inside-avoid"
                >
                  <Polaroid
                    src={ph(item.seed, 500, 620)}
                    alt={item.caption}
                    aspectRatio={i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4"}
                    caption={item.caption}
                    stamp={item.stamp || undefined}
                  />
                </motion.figure>
              ))}

              <motion.figure
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * ITEMS.length, duration: 0.45 }}
                className="mb-4 break-inside-avoid"
              >
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
                    silly video evidence
                  </figcaption>
                </div>
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
