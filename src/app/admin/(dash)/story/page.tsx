import StorySections from "@/components/admin/story/StorySections";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { ZINE_SECTIONS } from "@/config/sections";

export const dynamic = "force-dynamic";

export default async function AdminStoryPage() {
  await connectDB();

  const memories = await Memory.find({})
    .select("title thumbnailUrl mediaType category slot visibility date featured")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <StorySections
      sections={ZINE_SECTIONS.map((s) => {
        const items: (typeof memories)[number][] = [];
        for (const m of memories) {
          if (
            m.category === s.category &&
            typeof m.slot === "number" &&
            m.slot >= 0 &&
            m.slot < s.slots
          ) {
            items[m.slot] = m;
          }
        }
        return { ...s, memories: items };
      })}
    />
  );
}
