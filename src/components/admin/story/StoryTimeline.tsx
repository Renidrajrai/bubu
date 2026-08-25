"use client";

import { useCallback, useState } from "react";
import type { StoryScene } from "@/config/scenes";
import SceneCard from "./SceneCard";
import AssignMemoryDialog from "./AssignMemoryDialog";

type SlotInfo = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  mediaType: string;
  visibility: string;
};

type Props = {
  scenes: StoryScene[];
  slotMap: Record<string, SlotInfo>;
  sceneEnabled: Record<string, boolean>;
};

export default function StoryTimeline({ scenes, slotMap, sceneEnabled }: Props) {
  const [assigning, setAssigning] = useState<{ sceneSlug: string; slotId: string; existing?: SlotInfo } | null>(null);

  const refresh = useCallback(() => {
    // Force a full page reload to re-fetch server data
    window.location.reload();
  }, []);

  function handleAssign(sceneSlug: string, slotId: string) {
    setAssigning({ sceneSlug, slotId, existing: slotMap[slotId] });
  }

  const totalSlots = scenes.reduce((n, s) => n + s.slots.length, 0);
  const filledSlots = Object.keys(slotMap).length;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">story</h1>
        <span className="text-xs text-text-secondary">
          {filledSlots} / {totalSlots} slots occupied
        </span>
      </div>

      <div className="space-y-1">
        {scenes.map((scene, i) => (
          <div key={scene.slug} className="flex items-stretch gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-[10px] font-medium text-text-secondary">
                {String(i + 1).padStart(2, "0")}
              </div>
              {i < scenes.length - 1 && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>

            {/* Scene card */}
            <div className="min-w-0 flex-1 pb-4">
              <SceneCard
                scene={scene}
                slots={scene.slots.map((sl) => ({
                  ...sl,
                  memory: slotMap[sl.id],
                }))}
                enabled={sceneEnabled[scene.slug] ?? true}
                onAssign={handleAssign}
              />
            </div>
          </div>
        ))}
      </div>

      {assigning && (
        <AssignMemoryDialog
          sceneSlug={assigning.sceneSlug}
          slotId={assigning.slotId}
          existing={assigning.existing}
          onClose={() => setAssigning(null)}
          onDone={() => { setAssigning(null); refresh(); }}
        />
      )}
    </div>
  );
}
