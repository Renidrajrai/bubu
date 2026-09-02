"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useEffect, useState, useRef, type ReactNode, Children } from "react";

const EASE = [0.22, 0.8, 0.22, 1] as const;

const MOBILE_QUERY = "(max-width: 650px)";

// True on small screens (phones) once mounted. Defaults to mobile (safe) so
// reveal-gated content is visible by default there — Framer's whileInView
// observer fires unreliably on phones and left content invisible at opacity:0.
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

/** Basic entrance: fade + rise, once, on scroll into view. Replaces the old data-motion observer. */
export function ScrollReveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (mobile) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.7, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a group of children and staggers their entrance. Use for the 4-photo collages. */
export function StaggerGroup({
  children,
  staggerDelay = 0.08,
  className,
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (mobile) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : staggerDelay } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Gentle depth on scroll — different layers move at different speeds. Keep `speed` small (0.08–0.2). */
export function ParallaxLayer({
  children,
  speed = 0.12,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Mobile: locked to speed 0 (no scroll-linked transform) — reliable + no jank.
  const active = mobile ? 0 : speed;
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [active * -80, active * 80]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Photo reveal: fade + scale-settle, feels like a print sliding into place. */
export function ImageReveal({
  src,
  alt,
  className,
  delay = 0,
  objectPosition,
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  objectPosition?: string;
  caption?: string;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (mobile) {
    return (
      <div className={className} style={{ overflow: "hidden" }}>
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
        />
        {caption && <figcaption>{caption}</figcaption>}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden" }}
      initial={{ opacity: reduced ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.7, delay: reduced ? 0 : delay, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: reduced ? 1 : 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: reduced ? 0.01 : 1.0, delay: reduced ? 0 : delay, ease: EASE }}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.div>
  );
}

/** Wraps BotanicalSticker/FloatingDoodle with a slow breathing float + delayed fade-in. */
export function FloatingDecor({
  children,
  driftPx = 6,
  duration = 4.5,
  className,
}: {
  children: ReactNode;
  driftPx?: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (reduced || mobile) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3, margin: "-5% 0px -5% 0px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        animate={{ y: [0, -driftPx, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
