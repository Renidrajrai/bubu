import StoryTimeline from "@/components/admin/story/StoryTimeline";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { Scene } from "@/models/Scene";
import { STORY_SCENES } from "@/config/scenes";

export const dynamic = "force-dynamic";

export default async function AdminStoryPage() {
  await connectDB();

  const [storyMemories, dbScenes] = await Promise.all([
    Memory.find({ placement: "story" })
      .select("title thumbnailUrl mediaType sceneId slotId visibility featured")
      .lean(),
    Scene.find().lean(),
  ]);

  // Build slot map: slotId → memory
  const slotMap = new Map<string, (typeof storyMemories)[number]>();
  for (const m of storyMemories) {
    if (m.slotId && !slotMap.has(m.slotId)) {
      slotMap.set(m.slotId, m);
    }
  }

  // Build scene enabled map
  const sceneEnabled = new Map(dbScenes.map((s) => [s.slug, s.enabled]));

  return (
    <StoryTimeline
      scenes={STORY_SCENES}
      slotMap={Object.fromEntries(
        Array.from(slotMap.entries()).map(([k, v]) => [k, { ...v, _id: String(v._id) }]),
      )}
      sceneEnabled={Object.fromEntries(sceneEnabled)}
    />
  );
}
