"use client";

import { useEffect, useState } from "react";

// §125, §129: Reduced motion support.
// Wraps animation-heavy components. Disables CSS animations and
// provides a context value for components to check.
// Uses CSS media query + JS state for components that need it.

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// CSS class-based approach: adds .reduced-motion to root when active.
// Components can check via CSS: .reduced-motion * { animation: none !important; }
export default function ReducedMotion() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      document.documentElement.classList.toggle("reduced-motion", mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return null;
}
