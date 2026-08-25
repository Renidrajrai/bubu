import type { ReactNode } from "react";
import BackgroundMood from "./BackgroundMood";
import PersistentGarden from "./PersistentGarden";
import CameraRig from "./CameraRig";
import ReducedMotion from "./ReducedMotion";

// Tall story wrapper — body carries the gradient; scenes pin inside here.
// §36: persistent garden layer sits behind all scenes.
// §95–§97: CameraRig provides scroll-linked scale + translateY.
// §105: background mood interpolates with scroll.
// §125: ReducedMotion adds CSS class for prefers-reduced-motion.
export default function StoryCanvas({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-[1] flex flex-col items-center overflow-x-clip">
      <ReducedMotion />
      <BackgroundMood />
      <PersistentGarden />
      <CameraRig>{children}</CameraRig>
    </main>
  );
}
