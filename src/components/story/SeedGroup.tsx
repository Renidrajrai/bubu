"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { SEED_PATHS } from "@/config/animation";
import type { SeedPathType } from "@/types/story";

// §106: Orchestrates multiple seed launches from dandelion head.
// Each seed has its own path, stagger, and optional memory card.

export type SeedFlight = {
  start: number;
  pathType: SeedPathType;
  x: string;
  y: string;
  rot: number;
  memory?: { src: string; alt: string };
};

export default function SeedGroup({
  progress,
  flights,
  className = "",
}: {
  progress: MotionValue<number>;
  flights: SeedFlight[];
  className?: string;
}) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      {flights.map((flight, i) => (
        <SeedLaunch key={i} progress={progress} {...flight} />
      ))}
    </div>
  );
}

function SeedLaunch({
  progress,
  start,
  pathType,
  x,
  y,
  rot,
  memory,
}: SeedFlight & { progress: MotionValue<number> }) {
  const end = start + 0.18;
  const t = useTransform(progress, [start, end], [0, 1]);
  const fx = useTransform(t, [0, 1], ["0vw", x]);
  const fy = useTransform(t, [0, 1], ["0vh", y]);
  const fr = useTransform(t, [0, 1], [0, rot]);
  const opacity = useTransform(t, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);

  // Memory card appears partway through flight
  const cardOpacity = memory ? useTransform(t, [0.3, 0.45], [0, 1]) : undefined;
  const cardScale = memory ? useTransform(t, [0.3, 0.5], [0.5, 1]) : undefined;

  return (
    <motion.div
      className="absolute left-1/2 top-[30%]"
      style={{ x: fx, y: fy, rotate: fr, opacity }}
    >
      {/* Seed body */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <line x1="12" y1="14" x2="12" y2="4" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="8" x2="6" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="8" x2="18" y2="3.5" stroke="#e8d9c8" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="12" cy="17.5" rx="2.6" ry="4.5" fill="var(--cocoa-soft)" />
      </svg>

      {/* Optional memory card */}
      {memory && cardOpacity && cardScale && (
        <motion.div
          className="absolute -top-8 left-5 w-20 sm:w-24"
          style={{ opacity: cardOpacity, scale: cardScale }}
        >
          <figure className="rounded-md bg-cloud p-1.5 pb-2 shadow-soft">
            <img
              src={memory.src}
              alt={memory.alt}
              className="aspect-square w-full rounded-sm object-cover"
              loading="lazy"
            />
          </figure>
        </motion.div>
      )}
    </motion.div>
  );
}
