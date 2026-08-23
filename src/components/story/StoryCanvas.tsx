import type { ReactNode } from "react";

// Tall story wrapper — body carries the gradient; scenes pin inside here.
export default function StoryCanvas({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-[1] flex flex-col items-center overflow-x-clip">
      {children}
    </main>
  );
}
