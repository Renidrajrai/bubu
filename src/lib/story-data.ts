import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { STORY_SCENES } from "@/config/scenes";

export type PublicMemory = {
  id: string;
  title: string;
  caption: string;
  date: string | null;
  thumbnailUrl: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  objectPosition: string;
  displayMode: string;
};

export type PublicSlot = {
  id: string;
  label: string;
  aspectRatio: string;
  memory: PublicMemory | null;
};

export type PublicScene = {
  slug: string;
  title: string;
  slots: PublicSlot[];
};

export type PublicStory = {
  scenes: PublicScene[];
  archive: PublicMemory[];
};

function toPublicMemory(m: Record<string, unknown>): PublicMemory {
  return {
    id: String(m._id),
    title: (m.title as string) ?? "",
    caption: (m.caption as string) ?? "",
    date: m.date ? new Date(m.date as string).toISOString() : null,
    thumbnailUrl: (m.thumbnailUrl as string) ?? "",
    mediaUrl: (m.cloudinaryUrl as string) ?? "",
    mediaType: (m.mediaType as "image" | "video") ?? "image",
    objectPosition: (m.objectPosition as string) ?? "center",
    displayMode: (m.displayMode as string) ?? "inline",
  };
}

export async function getPublicStory(): Promise<PublicStory> {
  await connectDB();

  const memories = await Memory.find({ visibility: "public" })
    .select("title caption date thumbnailUrl cloudinaryUrl mediaType sceneId slotId placement objectPosition displayMode")
    .lean();

  const slotMap = new Map<string, PublicMemory>();
  for (const m of memories) {
    const sceneId = m.sceneId as string | null;
    const slotId = m.slotId as string | null;
    if (sceneId && slotId) {
      slotMap.set(`${sceneId}-${slotId}`, toPublicMemory(m));
    }
  }

  const scenes: PublicScene[] = STORY_SCENES.map((scene) => ({
    slug: scene.slug,
    title: scene.title,
    slots: scene.slots.map((slot) => ({
      id: slot.id,
      label: slot.label,
      aspectRatio: slot.aspectRatio,
      memory: slotMap.get(`${scene.slug}-${slot.id}`) ?? null,
    })),
  }));

  const archive: PublicMemory[] = memories
    .filter((m) => m.placement === "archive")
    .map(toPublicMemory);

  return { scenes, archive };
}
