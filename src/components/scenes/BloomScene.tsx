"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { Petal } from "../flowers";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";
import Thread from "../story/Thread";

const PETAL_D = "M0 -10 C -13 -26, -13 -48, 0 -58 C 13 -48, 13 -26, 0 -10 Z";
const PETALS = [0, 72, 144, 216, 288];

// Beat 1 - a flower blooms, holds a memory at its heart,
// then the memory + one petal drift away (hands off to the dandelion).
export default function BloomScene() {
  return <SceneShell vh={340}>{(p) => <Content p={p} />}</SceneShell>;
}

function BloomPetal({
  deg,
  start,
  p,
}: {
  deg: number;
  start: number;
  p: MotionValue<number>;
}) {
  const scale = useTransform(p, [start, start + 0.1], [0, 1]);
  const opacity = useTransform(p, [start, start + 0.04], [0, 1]);
  return (
    <g transform={`rotate(${deg})`}>
      <motion.path
        d={PETAL_D}
        fill="var(--blush-2)"
        style={{ scale, opacity, transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
    </g>
  );
}

function Content({ p }: { p: MotionValue<number> }) {
  const stemLength = useTransform(p, [0.02, 0.24], [0, 1]);
  const stemOpacity = useTransform(p, [0.02, 0.05], [0, 1]);

  const headScale = useTransform(p, [0.22, 0.34], [0.3, 1]);
  const headOpacity = useTransform(p, [0.22, 0.28], [0, 1]);

  const photoOpacity = useTransform(p, [0.56, 0.64], [0, 1]);
  const photoScale = useTransform(p, [0.56, 0.7], [0.55, 1]);

  const captionOpacity = useTransform(p, [0.58, 0.64, 0.72, 0.76], [0, 1, 1, 0]);

  const fallY = useTransform(p, [0.72, 0.97], ["0vh", "80vh"]);
  const fallX = useTransform(p, [0.72, 0.82, 0.92], ["0vw", "-5vw", "-9vw"]);
  const fallRotate = useTransform(p, [0.72, 0.97], [0, 12]);

  return (
    <>
      <Thread progress={p} d="M62 -5 C 58 25, 66 55, 60 105" range={[0.78, 1]} />

      {/* stem */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.path
          d="M50 98 C 48 78, 52 60, 50 42"
          stroke="var(--cocoa-soft)"
          strokeWidth={0.7}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: stemOpacity }}
        />
        <motion.circle cx="50" cy="96" r="1" fill="var(--cocoa-soft)" style={{ opacity: stemOpacity }} />
      </svg>

      {/* flower head + petals */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2">
        <motion.div
          className="relative h-40 w-40 sm:h-48 sm:w-48"
          style={{ scale: headScale, opacity: headOpacity }}
        >
          {PETALS.map((deg, i) => (
            <BloomPetal key={deg} deg={deg} start={0.26 + i * 0.05} p={p} />
          ))}
          <svg viewBox="-60 -60 120 120" className="absolute inset-0 h-full w-full">
            <circle r="10" fill="var(--gold)" />
            <circle r="4.5" fill="var(--caramel)" />
          </svg>
        </motion.div>
      </div>

      {/* the memory, held at the flower's heart — then it falls */}
      <motion.div
        className="absolute left-1/2 top-[30%] w-36 -translate-x-1/2 sm:w-44"
        style={{ opacity: photoOpacity, scale: photoScale }}
      >
        <motion.div style={{ y: fallY, x: fallX, rotate: fallRotate }}>
          <Petal className="absolute -top-9 -left-7 w-7" />
          <Polaroid
            src={ph("pattu-01", 900, 1200)}
            alt="the first memory"
            aspectRatio="3/4"
            caption="where it started"
          />
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute top-[62%] font-hand text-2xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        and so it begins.
      </motion.p>
    </>
  );
}
