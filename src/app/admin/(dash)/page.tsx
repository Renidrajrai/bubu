import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import { Scene } from "@/models/Scene";
import { STORY_SCENES } from "@/config/scenes";
import type { StoryHealthStatus } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [allMemories, assets, dbScenes] = await Promise.all([
    Memory.find()
      .select("title thumbnailUrl mediaType visibility sceneId slotId placement featured createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    MediaAsset.find().select("publicId").lean(),
    Scene.find().lean(),
  ]);

  // Stats
  const total = allMemories.length;
  const publicCount = allMemories.filter((m) => m.visibility === "public").length;
  const hiddenCount = total - publicCount;
  const storyCount = allMemories.filter((m) => m.placement === "story").length;
  const archiveCount = total - storyCount;
  const imageCount = allMemories.filter((m) => m.mediaType === "image").length;
  const videoCount = total - imageCount;

  // Orphan detection
  const usedPublicIds = new Set(
    allMemories.map((m) => m.cloudinaryPublicId).filter(Boolean),
  );
  const orphanCount = assets.filter((a) => !usedPublicIds.has(a.publicId)).length;

  // Story health
  const storyMemories = allMemories.filter((m) => m.sceneId && m.slotId);
  const occupiedSlots = new Map<string, string>(); // slotId → memoryId
  const conflicts: string[] = [];
  for (const m of storyMemories) {
    const key = m.slotId!;
    if (occupiedSlots.has(key)) {
      conflicts.push(key);
    } else {
      occupiedSlots.set(key, String(m._id));
    }
  }

  const storyHealth: StoryHealthStatus[] = STORY_SCENES.map((scene) => {
    const dbScene = dbScenes.find((s) => s.slug === scene.slug);
    const assignedCount = scene.slots.filter((sl) => occupiedSlots.has(sl.id)).length;
    const emptyCount = scene.slots.length - assignedCount;
    const conflictCount = scene.slots.filter((sl) => conflicts.includes(sl.id)).length;
    return {
      scene,
      configured: dbScene?.enabled ?? false,
      assignedCount,
      emptyCount,
      conflictCount,
      dbSceneEnabled: dbScene?.enabled ?? false,
    };
  });

  const totalSlots = STORY_SCENES.reduce((n, s) => n + s.slots.length, 0);
  const occupiedSlotCount = occupiedSlots.size;

  // Recent memories (top 8)
  const recent = allMemories.slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-lg font-medium">dashboard</h1>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "Memories", value: total },
          { label: "Public", value: publicCount },
          { label: "Hidden", value: hiddenCount },
          { label: "Story", value: `${storyCount}` },
          { label: "Images", value: imageCount },
          { label: "Videos", value: videoCount },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="font-display text-xl font-medium">{s.value}</p>
            <p className="text-[10px] text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Story Health ───────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">story health</h2>
          <span className="text-xs text-text-secondary">
            {occupiedSlotCount} / {totalSlots} slots occupied
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          {storyHealth.map((sh) => (
            <div key={sh.scene.slug} className="flex items-center gap-2 text-xs">
              <span className={`shrink-0 ${sh.scene.slots.length === 0 ? "text-text-secondary" : sh.emptyCount === 0 && sh.conflictCount === 0 ? "text-deep-sage" : "text-warm-red"}`}>
                {sh.scene.slots.length === 0 ? "✓" : sh.emptyCount === 0 && sh.conflictCount === 0 ? "✓" : "⚠"}
              </span>
              <span className="font-medium capitalize">{sh.scene.title}</span>
              <span className="text-text-secondary">
                {sh.scene.slots.length === 0
                  ? "configured"
                  : `${sh.assignedCount} / ${sh.scene.slots.length} memories`}
              </span>
              {sh.conflictCount > 0 && (
                <span className="text-warm-red">· {sh.conflictCount} conflict{sh.conflictCount > 1 ? "s" : ""}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ── Recent Memories ────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium">recent memories</h2>
            <a href="/admin/memories" className="text-[10px] text-text-secondary hover:text-text-primary">
              view all
            </a>
          </div>
          <div className="mt-3 space-y-1.5">
            {recent.length === 0 && (
              <p className="text-xs text-text-secondary">no memories yet</p>
            )}
            {recent.map((m) => (
              <a
                key={String(m._id)}
                href={`/admin/memories?edit=${String(m._id)}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-muted/50"
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${m.visibility === "public" ? "bg-deep-sage" : "bg-text-secondary/40"}`} />
                <span className="truncate text-xs font-medium">{m.title || "(untitled)"}</span>
                <span className="ml-auto shrink-0 text-[10px] text-text-secondary">
                  {m.mediaType === "video" ? "vid" : "img"}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Orphan Warning + Quick Actions ────────────────────── */}
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <h2 className="text-sm font-medium">media cleanup</h2>
            {orphanCount === 0 ? (
              <p className="mt-2 text-xs text-text-secondary">no orphan assets</p>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-text-secondary">
                  {orphanCount} unused media asset{orphanCount > 1 ? "s" : ""}
                </p>
                <a
                  href="/admin/media?filter=orphan"
                  className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary"
                >
                  review
                </a>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface p-4">
            <h2 className="text-sm font-medium">quick actions</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { label: "Add Memory", href: "/admin/memories?upload=true" },
                { label: "Story Editor", href: "/admin/story" },
                { label: "Media Library", href: "/admin/media" },
                { label: "View Website", href: "/" },
              ].map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-text-secondary hover:text-text-primary"
                >
                  {a.label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
