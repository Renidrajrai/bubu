"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { DandelionHead } from "@/assets/flowers";
import StemDraw from "../story/StemDraw";
import WindEffect from "../story/WindEffect";
import SeedGroup, { type SeedFlight } from "../story/SeedGroup";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";
import Thread from "../story/Thread";

const FLIGHTS: SeedFlight[] = [
  { start: 0.3, pathType: "curveLeft",  x: "-32vw", y: "-18vw", rot: -22, memory: { src: ph("pattu-02", 400, 400), alt: "seed 1" } },
  { start: 0.42, pathType: "curveRight", x: "26vw",  y: "-24vw", rot: 16,  memory: { src: ph("pattu-03", 400, 400), alt: "seed 2" } },
  { start: 0.54, pathType: "playful",   x: "-22vw", y: "12vw",  rot: -12, memory: { src: ph("pattu-05", 400, 400), alt: "seed 3" } },
  { start: 0.66, pathType: "straight",  x: "30vw",  y: "4vw",   rot: 20,  memory: { src: ph("pattu-06", 400, 400), alt: "seed 4" } },
];

export default function DandelionScene() {
  return <SceneShell vh={420}>{(p) => <Content p={p} />}</SceneShell>;
}

function Content({ p }: { p: MotionValue<number> }) {
  // Stem
  const stemLength = useTransform(p, [0, 0.12], [0, 1]);
  const stemOpacity = useTransform(p, [0, 0.04], [0, 1]);

  // Head
  const headScale = useTransform(p, [0.1, 0.18], [0.2, 1]);
  const headOpacity = useTransform(p, [0.1, 0.16], [0, 1]);
  const headRotate = useTransform(p, [0.22, 0.3, 0.38, 0.46, 0.54], [0, 7, -5, 8, -3]);

  // Fallen memory
  const landY = useTransform(p, [0.02, 0.1, 0.14], ["-50vh", "1.5vh", "0vh"]);
  const landRotate = useTransform(p, [0.02, 0.14], [-8, 4]);
  const landOpacity = useTransform(p, [0.02, 0.06], [0, 1]);

  // Caption
  const captionOpacity = useTransform(p, [0.62, 0.7, 0.9, 0.96], [0, 1, 1, 0]);

  return (
    <>
      <Thread progress={p} d="M40 -5 C 44 25, 36 55, 42 105" range={[0.82, 1]} />

      {/* Stem + ground */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <StemDraw
          progress={p}
          d="M52 98 C 51 80, 53 66, 52 52"
          strokeWidth={0.7}
          range={[0, 0.12]}
        />
        <motion.line
          x1="20" y1="97" x2="84" y2="97"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.5}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: 0.35 }}
        />
      </svg>

      {/* Wind lines */}
      <WindEffect
        progress={p}
        range={[0.22, 0.56]}
        preset="medium"
        headRotate={headRotate}
      />

      {/* Dandelion head */}
      <div className="absolute left-[52%] top-[52%] -translate-x-1/2">
        <motion.div
          className="h-24 w-24 sm:h-28 sm:w-28"
          style={{ scale: headScale, opacity: headOpacity, rotate: headRotate }}
        >
          <DandelionHead className="h-full w-full" />
        </motion.div>
      </div>

      {/* Seeds flying */}
      <SeedGroup progress={p} flights={FLIGHTS} />

      {/* Fallen memory */}
      <div className="absolute left-[30%] top-[58%] w-32 -translate-x-1/2 sm:w-40">
        <motion.div style={{ y: landY, rotate: landRotate, opacity: landOpacity }}>
          <Polaroid
            src={ph("pattu-01", 900, 1200)}
            alt="where it started"
            aspectRatio="3/4"
            caption="it drifted here"
          />
        </motion.div>
      </div>

      <motion.p
        className="absolute bottom-[16%] font-hand text-2xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        the wind carries our stories.
      </motion.p>
    </>
  );
}
