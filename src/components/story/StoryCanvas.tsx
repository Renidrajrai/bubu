import type { ReactNode } from "react";
import BackgroundMood from "./BackgroundMood";
import ReducedMotion from "./ReducedMotion";

export default function StoryCanvas({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-[1] flex flex-col items-center overflow-x-clip">
      <ReducedMotion />
      <BackgroundMood />
      {children}
    </main>
  );
}
