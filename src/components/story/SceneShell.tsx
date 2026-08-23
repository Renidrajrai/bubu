"use client";

import { useScroll, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

// Vertically-ordered scrollytelling scene (reference arch): a tall section
// provides scroll distance; the inner stage is CSS-sticky-pinned for that
// duration and hands its 0→1 progress to children via render prop.
export default function SceneShell({
  vh,
  children,
}: {
  vh: number;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={ref} className="relative w-full" style={{ height: `${vh}svh` }}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </section>
  );
}
