"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { FlowerHead } from "../flowers";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";

// Beat 3 - three seeds germinate; each sprout blooms and holds
// a photo above it in its petals.
export default function GrowScene() {
  return <SceneShell vh={320}>{(p) => <Content p={p} />}</SceneShell>;
}

const PLANTS = [
  { left: "24%", start: 0.12, seed: "pattu-04", w: "w-32 sm:w-40", caption: "road trip, day one" },
  { left: "50%", start: 0.28, seed: "pattu-07", w: "w-36 sm:w-44", caption: "soft morning light" },
  { left: "75%", start: 0.44, seed: "pattu-08", w: "w-28 sm:w-36", caption: "golden hour, always" },
];

function Plant({
  p,
  left,
  start,
  seed,
  w,
  caption,
}: {
  p: MotionValue<number>;
  left: string;
  start: number;
  seed: string;
  w: string;
  caption: string;
}) {
  const headScale = useTransform(p, [start + 0.1, start + 0.2], [0.2, 1]);
  const cardOpacity = useTransform(p, [start + 0.16, start + 0.24], [0, 1]);
  const cardY = useTransform(p, [start + 0.16, start + 0.28], [46, 0]);

  return (
    <div className="absolute bottom-[16%]" style={{ left }}>
      {/* flower holding the photo */}
      <div className="relative -translate-x-1/2">
        <motion.div
          className={`relative ${w}`}
          style={{ opacity: cardOpacity, y: cardY }}
        >
          <Polaroid src={ph(seed, 600, 750)} alt={caption} aspectRatio="4/5" caption={caption} />
        </motion.div>

        {/* bloom under the photo */}
        <motion.div
          className="absolute -bottom-7 left-1/2 h-20 w-20 -translate-x-1/2"
          style={{ scale: headScale }}
        >
          <FlowerHead className="h-full w-full" />
        </motion.div>
      </div>
    </div>
  );
}

function Content({ p }: { p: MotionValue<number> }) {
  const groundLength = useTransform(p, [0.02, 0.12], [0, 1]);
  const groundOpacity = useTransform(p, [0.02, 0.06], [0, 0.4]);

  const captionOpacity = useTransform(p, [0.82, 0.9], [0, 1]);

  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.line
          x1="10" y1="84" x2="90" y2="84"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.6}
          strokeLinecap="round"
          style={{ pathLength: groundLength, opacity: groundOpacity }}
        />
        {PLANTS.map((pl) => (
          <Stem key={pl.seed} p={p} x={parseFloat(pl.left)} start={pl.start} />
        ))}
      </svg>

      {PLANTS.map((pl) => (
        <Plant key={pl.seed} {...pl} p={p} />
      ))}

      <motion.p
        className="absolute top-[14%] font-hand text-3xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        and every seed starts again.
      </motion.p>
    </>
  );
}

function Stem({
  p,
  x,
  start,
}: {
  p: MotionValue<number>;
  x: number;
  start: number;
}) {
  const length = useTransform(p, [start, start + 0.14], [0, 1]);
  return (
    <motion.line
      x1={x} y1="84" x2={x} y2="60"
      stroke="var(--cocoa-soft)"
      strokeWidth={0.8}
      strokeLinecap="round"
      style={{ pathLength: length, opacity: 0.7 }}
    />
  );
}
