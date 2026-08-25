"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { Petal, FlowerCenter } from "@/assets/flowers";
import StemDraw from "../story/StemDraw";
import { ph } from "./placeholders";
import SceneShell from "../story/SceneShell";
import Thread from "../story/Thread";
import { FLOWER_TIMING } from "@/config/animation";

const PETAL_D = "M0 -10 C -13 -26, -13 -48, 0 -58 C 13 -48, 13 -26, 0 -10 Z";
const PETALS = [0, 72, 144, 216, 288];

export default function BloomScene() {
  return <SceneShell vh={340}>{(p) => <Content p={p} />}</SceneShell>;
}

// ── Individual bloom petal — unfurls with stagger ─────────────────

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

// ── Bloom scene content ───────────────────────────────────────────

function Content({ p }: { p: MotionValue<number> }) {
  const t = FLOWER_TIMING;

  // Stem draw
  const stemEnd = t.stem;
  const stemLength = useTransform(p, [0.02, stemEnd], [0, 1]);
  const stemOpacity = useTransform(p, [0.02, 0.05], [0, 1]);

  // Flower head scale
  const headStart = stemEnd * 0.85;
  const headScale = useTransform(p, [headStart, headStart + 0.12], [0.3, 1]);
  const headOpacity = useTransform(p, [headStart, headStart + 0.06], [0, 1]);

  // Center
  const centerStart = headStart + 0.15;
  const centerScale = useTransform(p, [centerStart, centerStart + 0.1], [0, 1]);
  const centerOpacity = useTransform(p, [centerStart, centerStart + 0.04], [0, 1]);

  // Petal attach spring (sway after bloom)
  const swayRaw = useTransform(p, [0.85, 0.95], [0, 1]);
  const sway = useSpring(swayRaw, { stiffness: 40, damping: 8 });

  // Memory reveal
  const memStart = 0.5;
  const photoOpacity = useTransform(p, [memStart, memStart + 0.08], [0, 1]);
  const photoScale = useTransform(p, [memStart, memStart + 0.14], [0.55, 1]);

  // Caption
  const captionOpacity = useTransform(p, [0.52, 0.58, 0.72, 0.76], [0, 1, 1, 0]);

  // Petal detach + fall
  const fallStart = 0.72;
  const fallY = useTransform(p, [fallStart, 0.97], ["0vh", "80vh"]);
  const fallX = useTransform(p, [fallStart, fallStart + 0.1, fallStart + 0.2], ["0vw", "-5vw", "-9vw"]);
  const fallRotate = useTransform(p, [fallStart, 0.97], [0, 12]);

  return (
    <>
      <Thread progress={p} d="M62 -5 C 58 25, 66 55, 60 105" range={[0.78, 1]} />

      {/* Stem */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <StemDraw
          progress={p}
          d="M50 98 C 48 78, 52 60, 50 42"
          strokeWidth={0.7}
          range={[0.02, stemEnd]}
        />
        <motion.circle cx="50" cy="96" r="1" fill="var(--cocoa-soft)" style={{ opacity: stemOpacity }} />
      </svg>

      {/* Flower head — petals + center */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2">
        <motion.div
          className="relative h-40 w-40 sm:h-48 sm:w-48"
          style={{ scale: headScale, opacity: headOpacity }}
        >
          {PETALS.map((deg, i) => (
            <BloomPetal key={deg} deg={deg} start={headStart + 0.04 + i * 0.05} p={p} />
          ))}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ scale: centerScale, opacity: centerOpacity }}
          >
            <FlowerCenter size={16} />
          </motion.div>
        </motion.div>
      </div>

      {/* Memory — held at flower heart, then falls */}
      <div className="absolute left-1/2 top-[30%] w-36 -translate-x-1/2 sm:w-44">
        <motion.div style={{ opacity: photoOpacity, scale: photoScale }}>
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
      </div>

      <motion.p
        className="absolute top-[62%] font-hand text-2xl text-cocoa"
        style={{ opacity: captionOpacity }}
      >
        and so it begins.
      </motion.p>
    </>
  );
}
