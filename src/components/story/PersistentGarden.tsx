"use client";

import { Sprout } from "@/assets/flowers";
import { FlowerDoodle, Butterfly } from "@/assets/decorative";

// §36, §105: Persistent garden layer behind all scenes.
// Botanical elements that persist across scene transitions.
// Background stems, leaves, small flowers, butterflies.

const GARDEN_ELEMENTS = [
  // Left side stems
  { type: "sprout" as const, left: "5%", bottom: "20%", size: 50, flip: false, delay: 0 },
  { type: "sprout" as const, left: "12%", bottom: "35%", size: 40, flip: true, delay: 0.5 },
  { type: "sprout" as const, left: "8%", bottom: "55%", size: 35, flip: false, delay: 1 },
  // Right side stems
  { type: "sprout" as const, left: "88%", bottom: "25%", size: 45, flip: true, delay: 0.3 },
  { type: "sprout" as const, left: "92%", bottom: "45%", size: 38, flip: false, delay: 0.8 },
  { type: "sprout" as const, left: "85%", bottom: "60%", size: 30, flip: true, delay: 1.2 },
  // Scattered doodle flowers
  { type: "flower" as const, left: "15%", bottom: "70%", size: 20, delay: 0.6 },
  { type: "flower" as const, left: "80%", bottom: "75%", size: 18, delay: 0.9 },
  { type: "flower" as const, left: "50%", bottom: "85%", size: 16, delay: 1.5 },
  // Butterflies
  { type: "butterfly" as const, left: "20%", bottom: "80%", size: 24, delay: 0.4 },
  { type: "butterfly" as const, left: "75%", bottom: "65%", size: 20, delay: 1.1 },
];

export default function PersistentGarden() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {GARDEN_ELEMENTS.map((el, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: el.left,
            bottom: el.bottom,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.type === "sprout" && (
            <Sprout
              height={el.size}
              flip={el.flip}
              className="opacity-20"
            />
          )}
          {el.type === "flower" && (
            <FlowerDoodle size={el.size} className="opacity-15" />
          )}
          {el.type === "butterfly" && (
            <Butterfly size={el.size} className="opacity-15" />
          )}
        </div>
      ))}
    </div>
  );
}
