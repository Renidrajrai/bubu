import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import { ZINE_SECTIONS } from "@/config/sections";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [allMemories, assets] = await Promise.all([
    Memory.find()
      .select("title thumbnailUrl mediaType visibility category placement featured createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    MediaAsset.find().select("publicId").lean(),
  ]);

  // Stats
  const total = allMemories.length;
  const publicCount = allMemories.filter((m) => m.visibility === "public").length;
  const hiddenCount = total - publicCount;
  const imageCount = allMemories.filter((m) => m.mediaType === "image").length;
  const videoCount = total - imageCount;

  // Section coverage — how many live-page sections have at least one photo
  const sectionCounts = ZINE_SECTIONS.map((s) => ({
    ...s,
    count: allMemories.filter((m) => m.category === s.category).length,
  }));

  // Orphan detection
  const usedPublicIds = new Set(
    allMemories.map((m) => m.cloudinaryPublicId).filter(Boolean),
  );
  const orphanCount = assets.filter((a) => !usedPublicIds.has(a.publicId)).length;

  // Recent memories (top 8)
  const recent = allMemories.slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-lg font-medium">dashboard</h1>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "Memories", value: total },
          { label: "Public", value: publicCount },
          { label: "Hidden", value: hiddenCount },
          { label: "Images", value: imageCount },
          { label: "Videos", value: videoCount },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="font-display text-xl font-medium">{s.value}</p>
            <p className="text-[10px] text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Section Coverage ───────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-medium">site sections</h2>
          <a href="/admin/story" className="text-[10px] text-text-secondary hover:text-text-primary">
            manage sections
          </a>
        </div>
        <div className="mt-3 space-y-1.5">
          {sectionCounts.map((s) => (
            <div key={s.category} className="flex items-center gap-2 text-xs">
              <span className={`shrink-0 ${s.count > 0 ? "text-cocoa" : "text-text-secondary"}`}>
                {s.count > 0 ? "✓" : "○"}
              </span>
              <span className="font-medium capitalize">{s.label}</span>
              <span className="text-text-secondary">
                {s.count} photo{s.count !== 1 ? "s" : ""} · {s.slots} slot{s.slots !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ── Recent Memories ────────────────────────────────────── */}
        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-medium">recent memories</h2>
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
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${m.visibility === "public" ? "bg-cocoa" : "bg-text-secondary/40"}`} />
                <span className="truncate text-xs font-medium">{m.title || "(untitled)"}</span>
                <span className="ml-auto shrink-0 text-[10px] text-text-secondary">
                  {m.category || "everyday"}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Orphan Warning + Quick Actions ────────────────────── */}
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <h2 className="font-display text-sm font-medium">media cleanup</h2>
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
            <h2 className="font-display text-sm font-medium">quick actions</h2>
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
