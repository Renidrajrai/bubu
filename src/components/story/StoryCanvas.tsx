import type { ReactNode } from "react";

// Tall story wrapper. Phase 6 adds the global scroll-progress context here.
export default function StoryCanvas({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex flex-col items-center overflow-x-clip bg-background px-6">
      {children}
    </main>
  );
}
