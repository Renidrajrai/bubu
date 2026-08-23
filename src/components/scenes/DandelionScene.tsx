"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { DandelionHead, Seed } from "../flowers";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";
import Thread from "../story/Thread";

// Beat 2 - the fallen memory lands beside a dandelion;
// wind gusts shake it loose and seeds fly off, each carrying a photo.
export default function DandelionScene() {
  return <SceneShell vh={420}>{(p) => <Content p={p} />}</SceneShell>;
}

const SEED_FLIGHTS = [
  { start: 0.3, x: "-32vw", y: "-18vw", rot: -22, seed: "pattu-02" },
  { start: 0.42, x: "26vw", y: "-24vw", rot: 16, seed: "pattu-03" },
  { start: 0.54, x: "-22vw", y: "12vw", rot: -12, seed: "pattu-05" },
  { start: 0.66, x: "30vw", y: "4vw", rot: 20, seed: "pattu-06" },
];

function SeedFlight({
  p,
  start,
  x,
  y,
  rot,
  seed,
}: {
  p: MotionValue<number>;
  start: number;
  x: string;
  y: string;
  rot: number;
  seed: string;
}) {
  const t = useTransform(p, [start, start + 0.15], [0, 1]);
  const fx = useTransform(t, [0, 1], ["0vw", x]);
  const fy = useTransform(t, [0, 1], ["0vh", y]);
  const fr = useTransform(t, [0, 1], [0, rot]);
  const opacity = useTransform(t, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);
  const cardOpacity = useTransform(t, [0.3, 0.45], [0, 1]);
  const cardScale = useTransform(t, [0.3, 0.5], [0.5, 1]);

  return (
    <motion.div
      className="absolute left-1/2 top-[30%]"
      style={{ x: fx, y: fy, rotate: fr, opacity }}
    >
      <Seed className="h-6 w-6" />
      <motion.div
        className="absolute -top-8 left-5 w-20 sm:w-24"
        style={{ opacity: cardOpacity, scale: cardScale }}
      >
        <Polaroid src={ph(seed, 400, 400)} alt="" aspectRatio="1/1" />
      </motion.div>
    </motion.div>
  );
}

function Content({ p }: { p: MotionValue<number> }) {
  const stemLength = useTransform(p, [0, 0.12], [0, 1]);
  const stemOpacity = useTransform(p, [0, 0.04], [0, 1]);

  const headScale = useTransform(p, [0.1, 0.18], [0.2, 1]);
  const headOpacity = useTransform(p, [0.1, 0.16], [0, 1]);

  // gusts bend the head back and forth
  const headRotate = useTransform(p, [0.22, 0.3, 0.38, 0.46, 0.54], [0, 7, -5, 8, -3]);

  const landY = useTransform(p, [0.02, 0.1, 0.14], ["-50vh", "1.5vh", "0vh"]);
  const landRotate = useTransform(p, [0.02, 0.14], [-8, 4]);
  const landOpacity = useTransform(p, [0.02, 0.06], [0, 1]);

  const gustA = useTransform(p, [0.22, 0.3, 0.38], [0, 1, 0]);
  const gustB = useTransform(p, [0.4, 0.48, 0.56], [0, 1, 0]);

  const captionOpacity = useTransform(p, [0.62, 0.7, 0.9, 0.96], [0, 1, 1, 0]);

  return (
    <>
      <Thread progress={p} d="M40 -5 C 44 25, 36 55, 42 105" range={[0.82, 1]} />

      {/* dandelion stem + ground */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.path
          d="M52 98 C 51 80, 53 66, 52 52"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.7}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: stemOpacity }}
        />
        <motion.line
          x1="20" y1="97" x2="84" y2="97"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.5}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: 0.35 }}
        />
        {/* wind gust arcs */}
        <motion.path
          d="M8 34 C 26 30, 40 36, 56 31 S 78 28, 88 33"
          stroke="var(--caramel)"
          strokeWidth={0.8}
          strokeLinecap="round"
          style={{ pathLength: gustA, opacity: gustA }}
        />
        <motion.path
          d="M12 44 C 30 41, 44 47, 60 42 S 80 40, 90 44"
          stroke="var(--caramel)"
          strokeWidth={0.7}
          strokeLinecap="round"
          style={{ pathLength: gustB, opacity: gustB }}
        />
      </svg>

      {/* head (shakes in the gusts) */}
      <div className="absolute left-[52%] top-[52%] -translate-x-1/2">
        <motion.div
          className="h-24 w-24 sm:h-28 sm:w-28"
          style={{ scale: headScale, opacity: headOpacity, rotate: headRotate }}
        >
          <DandelionHead className="h-full w-full" />
        </motion.div>
      </div>

      {SEED_FLIGHTS.map((f) => (
        <SeedFlight key={f.seed} {...f} p={p} />
      ))}

      {/* the fallen memory lands beside it */}
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
