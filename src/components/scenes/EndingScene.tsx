"use client";

import { useState } from "react";
import ArchiveOverlay from "../archive/ArchiveOverlay";

export default function EndingScene() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative z-[2] w-full px-4 py-[10vh] text-center sm:px-6 sm:py-[14vh]">
      <h2 className="font-display text-2xl font-semibold text-cocoa sm:text-3xl md:text-4xl">
        the story keeps going
        <span className="ml-2 font-hand text-3xl font-bold text-rose sm:text-4xl md:text-5xl">
          , obviously.
        </span>
      </h2>
      <p className="mx-auto mt-4 max-w-sm font-medium leading-relaxed text-cocoa-soft">
        new memories bloom, drift, and take root — same garden, next seed.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cocoa px-6 py-3 font-display text-sm font-medium tracking-wide text-cloud shadow-soft transition-transform duration-300 [transition-timing-function:var(--ease-pop)] hover:scale-105 active:scale-95"
      >
        🐾 see every photo
      </button>

      <ArchiveOverlay open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
