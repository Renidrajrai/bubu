"use client";

import { motion, useTransform, useSpring, type MotionValue } from "motion/react";
import Polaroid from "../media/Polaroid";
import { FlowerCenter } from "@/assets/flowers";
import StemDraw from "../story/StemDraw";
import SceneShell from "../story/SceneShell";
import SceneCamera from "../story/SceneCamera";
import { FLOWER_TIMING, CAMERA_PRESETS } from "@/config/animation";
import type { PublicSlot } from "@/lib/story-data";

function Bubu() {
  return (
    <svg width="70" height="78" viewBox="0 0 72 80" aria-hidden>
      <ellipse cx="36" cy="46" rx="26" ry="24" fill="#54372B" />
      <circle cx="14" cy="16" r="11" fill="#54372B" />
      <circle cx="58" cy="16" r="11" fill="#54372B" />
      <circle cx="14" cy="16" r="5" fill="#8A6455" />
      <circle cx="58" cy="16" r="5" fill="#8A6455" />
      <ellipse cx="36" cy="50" rx="15" ry="13" fill="#F3D9C4" />
      <circle cx="27" cy="42" r="2.6" fill="#2C1B14" />
      <circle cx="45" cy="42" r="2.6" fill="#2C1B14" />
      <ellipse cx="22" cy="52" rx="4" ry="2.6" fill="#F6C6D2" opacity=".85" />
      <ellipse cx="50" cy="52" rx="4" ry="2.6" fill="#F6C6D2" opacity=".85" />
      <path d="M31 51 Q36 56 41 51" stroke="#2C1B14" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Dudu() {
  return (
    <svg width="70" height="78" viewBox="0 0 72 80" aria-hidden style={{ marginLeft: -8 }}>
      <ellipse cx="36" cy="46" rx="26" ry="24" fill="#FFFDF9" stroke="#F0E2D6" strokeWidth="1" />
      <circle cx="14" cy="16" r="11" fill="#2C1B14" />
      <circle cx="58" cy="16" r="11" fill="#2C1B14" />
      <ellipse cx="36" cy="50" rx="15" ry="13" fill="#FFFDF9" />
      <ellipse cx="24" cy="44" rx="7" ry="8" fill="#2C1B14" />
      <ellipse cx="48" cy="44" rx="7" ry="8" fill="#2C1B14" />
      <circle cx="25" cy="43" r="2.4" fill="#FFFDF9" />
      <circle cx="49" cy="43" r="2.4" fill="#FFFDF9" />
      <ellipse cx="22" cy="53" rx="4" ry="2.6" fill="#F6C6D2" opacity=".9" />
      <ellipse cx="50" cy="53" rx="4" ry="2.6" fill="#F6C6D2" opacity=".9" />
      <path d="M31 52 Q36 57 41 52" stroke="#2C1B14" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function EmptyHeroSlot() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 40 60" className="h-16 w-10 opacity-40">
        <path d="M20 58 C 20 42, 20 34, 20 20" stroke="var(--cocoa-soft)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="20" cy="16" rx="6" ry="8" fill="var(--blush-2)" opacity="0.6" />
      </svg>
      <p className="font-hand text-lg text-cocoa-soft/60">the first memory will bloom here</p>
    </div>
  );
}

function HeroContent({ p, slots }: { p: MotionValue<number>; slots: PublicSlot[] }) {
  const heroMemory = slots[0]?.memory ?? null;
  const t = FLOWER_TIMING;
  const stemEnd = t.stem * 0.8;

  const stemOpacity = useTransform(p, [0.1, 0.14], [0, 1]);
  const headStart = stemEnd * 0.8;
  const headScale = useTransform(p, [headStart, headStart + 0.12], [0.2, 1]);
  const headOpacity = useTransform(p, [headStart, headStart + 0.06], [0, 1]);
  const centerStart = headStart + 0.12;
  const centerScale = useTransform(p, [centerStart, centerStart + 0.1], [0, 1]);
  const sway = useSpring(
    useTransform(p, [0.85, 0.95], [0, 1]),
    { stiffness: 40, damping: 8 },
  );

  const heroOpacity = useTransform(p, [0, 0.05], [1, 1]);
  const heroY = useTransform(p, [0, 0.3], [0, -20]);

  return (
    <SceneCamera progress={p} config={CAMERA_PRESETS.intro}>
    <motion.div
      className="flex min-h-[92svh] w-full flex-col items-center justify-center px-4 pb-16 pt-[7vh] text-center sm:px-6 sm:pb-20 sm:pt-[9vh]"
      style={{ opacity: heroOpacity, y: heroY }}
    >
      <div className="hero-in flex items-end">
        <Bubu />
        <Dudu />
      </div>

      <p className="hero-in mt-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-rose [animation-delay:120ms]">
        a little corner just for him
      </p>
      <h1 className="hero-in mt-2 font-display text-5xl font-semibold leading-none text-cocoa sm:text-7xl [animation-delay:200ms]">
        every{" "}
        <span className="wiggle text-rose">little</span>{" "}
        moment
      </h1>
      <p className="hero-in mt-4 max-w-md font-hand text-2xl leading-snug text-cocoa-soft [animation-delay:280ms]">
        pictures of you, us, and everything in between —
        <br />
        scroll slowly, like flipping through our album.
      </p>

      <div className="relative mt-12 h-[300px] w-full max-w-md sm:h-[340px]">
        {heroMemory ? (
          <>
            <div className="hero-in absolute left-0 top-8 w-32 rotate-[-10deg] sm:left-4 sm:w-40 [animation-delay:420ms]">
              <Polaroid src={heroMemory.mediaUrl} alt="" aspectRatio="3/4" tape />
            </div>
            <div className="hero-in absolute right-0 top-6 w-32 rotate-[9deg] sm:right-4 sm:w-40 [animation-delay:520ms]">
              <Polaroid src={heroMemory.mediaUrl} alt="" aspectRatio="3/4" tape />
            </div>
            <div className="hero-in absolute left-1/2 top-0 z-10 w-44 -translate-x-1/2 rotate-[2deg] sm:w-56 [animation-delay:340ms]">
              <Polaroid
                src={heroMemory.mediaUrl}
                alt={heroMemory.title || "the first photo"}
                aspectRatio="3/4"
                caption={heroMemory.caption || "where it started"}
              />
            </div>
          </>
        ) : (
          <div className="hero-in absolute left-1/2 top-8 -translate-x-1/2 [animation-delay:340ms]">
            <EmptyHeroSlot />
          </div>
        )}
      </div>

      {/* Hero flower — grows as user scrolls */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2">
        <svg
          viewBox="0 0 60 80"
          className="pointer-events-none absolute bottom-0 left-1/2 h-20 w-12 -translate-x-1/2"
        >
          <StemDraw
            progress={p}
            d="M30 78 C 30 60, 30 48, 30 30"
            strokeWidth={2}
            range={[0.1, stemEnd]}
          />
        </svg>

        <motion.div
          className="absolute bottom-[52%] left-1/2 -translate-x-1/2"
          style={{ scale: headScale, opacity: headOpacity, rotate: sway }}
        >
          <svg viewBox="-30 -30 60 60" className="h-20 w-20 sm:h-24 sm:w-24">
            {[0, 72, 144, 216, 288].map((deg) => (
              <path
                key={deg}
                d="M0 -6 C -8 -16, -8 -28, 0 -34 C 8 -28, 8 -16, 0 -6 Z"
                fill="var(--blush-2)"
                transform={`rotate(${deg})`}
              />
            ))}
            <motion.g style={{ scale: centerScale }}>
              <FlowerCenter size={10} />
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator — botanical SVG */}
      <div className="mt-10 flex flex-col items-center gap-1 font-display text-xs uppercase tracking-[0.12em] text-cocoa-soft">
        <svg viewBox="0 0 24 40" className="h-8 w-5 text-cocoa-soft/50" aria-hidden>
          <path d="M12 38 C 12 28, 12 22, 12 12" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <ellipse cx="12" cy="10" rx="3" ry="4" fill="currentColor" opacity="0.4" />
        </svg>
        scroll slowly
      </div>
    </motion.div>
    </SceneCamera>
  );
}

export default function IntroScene({ slots }: { slots: PublicSlot[] }) {
  return (
    <SceneShell vh={200}>
      {(p) => <HeroContent p={p} slots={slots} />}
    </SceneShell>
  );
}
