import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { Scene } from "@/models/Scene";
import { STORY_SCENES } from "@/config/scenes";

export const dynamic = "force-dynamic";

export default async function AdminScenesPage() {
  await connectDB();
  const [memories, scenes] = await Promise.all([
    Memory.find({ sceneId: { $ne: null } }).lean(),
    Scene.find().sort({ order: 1 }).lean(),
  ]);

  const bySlot = new Map<string, (typeof memories)[number]>();
  for (const m of memories) {
    if (m.slotId && !bySlot.has(m.slotId)) bySlot.set(m.slotId, m);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <h1 className="text-lg font-medium">scenes</h1>
      <p className="-mt-4 text-xs text-text-secondary">
        where each uploaded memory appears in the story. boxes show the slot&apos;s aspect ratio.
      </p>

      {STORY_SCENES.map((scene) => {
        const dbScene = scenes.find((s) => s.slug === scene.slug);
        return (
          <section key={scene.slug} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium">
                {scene.slug} · <span className="font-normal text-text-secondary">{dbScene?.title ?? scene.title}</span>
              </h2>
              {!dbScene?.enabled && <span className="text-[10px] uppercase tracking-widest text-warm-red">disabled</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {scene.slots.map((slot) => {
                const memory = bySlot.get(slot.id);
                return (
                  <div key={slot.id} className="flex flex-col gap-1">
                    <div
                      className="relative w-32 overflow-hidden rounded-md bg-surface-muted"
                      style={{ aspectRatio: slot.aspectRatio }}
                    >
                      {memory?.thumbnailUrl ? (
                        <Image
                          src={memory.thumbnailUrl}
                          alt={memory.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-text-secondary">
                          empty
                        </span>
                      )}
                    </div>
                    <span className="max-w-32 truncate text-center font-mono text-[10px] text-text-secondary">
                      {slot.label}
                      {memory ? ` · ${memory.title || "untitled"}` : ""}
                    </span>
                  </div>
                );
              })}
              {scene.slots.length === 0 && (
                <p className="text-xs text-text-secondary">no slots defined yet</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
