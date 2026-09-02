import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { Settings, STORY_TEXT_DEFAULTS } from "@/models/Settings";

export type ZineMedia = {
  id: string;
  title: string;
  caption: string;
  mediaType: "image" | "video";
  url: string;
  thumbnailUrl: string;
  category: string;
  objectPosition: string;
  date: string | null;
  slot: number | null;
};

export type ZinePayload = {
  items: ZineMedia[];
  text: Record<string, string>;
};

export const DEFAULT_SITE_TITLE = "PATTU — Visual Archive";

// Safe read of the site title for the admin brand + browser tab. Never
// throws — falls back to the default if the DB isn't reachable.
export async function getSiteTitle(): Promise<string> {
  try {
    await connectDB();
    const doc = await Settings.findOne().select("siteTitle").lean();
    if (doc?.siteTitle && typeof doc.siteTitle === "string" && doc.siteTitle.trim()) {
      return doc.siteTitle.trim();
    }
  } catch (err) {
    console.error("[zine] could not load site title:", err);
  }
  return DEFAULT_SITE_TITLE;
}

function toText(data: unknown): Record<string, string> {
  const merged = data && typeof data === "object"
    ? { ...STORY_TEXT_DEFAULTS, ...(data as Record<string, unknown>) }
    : STORY_TEXT_DEFAULTS;
  const text: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) {
    text[k] = typeof v === "string" ? v : "";
  }
  return text;
}

// Public memories + editable copy for the zine homepage. Never throws — an
// empty list just keeps the zine on its built-in placeholders.
export async function getZineContent(): Promise<ZinePayload> {
  try {
    await connectDB();
    const [memories, settings] = await Promise.all([
      Memory.find({ visibility: "public" })
        .select(
          "title caption mediaType cloudinaryUrl thumbnailUrl category objectPosition date slot"
        )
        .sort({ createdAt: -1 })
        .lean(),
      Settings.findOne().select("storyText").lean(),
    ]);

    return {
      items: memories.map((m) => ({
        id: String(m._id),
        title: (m.title as string) ?? "",
        caption: (m.caption as string) ?? "",
        mediaType: (m.mediaType as "image" | "video") ?? "image",
        url: (m.cloudinaryUrl as string) ?? "",
        thumbnailUrl: (m.thumbnailUrl as string) ?? "",
        category: (m.category as string) ?? "",
        objectPosition: (m.objectPosition as string) ?? "center",
        date: m.date ? new Date(m.date as string).toISOString() : null,
        slot: typeof m.slot === "number" && m.slot >= 0 ? (m.slot as number) : null,
      })),
      text: toText(settings?.storyText),
    };
  } catch (err) {
    console.error("[zine] could not load content:", err);
    return { items: [], text: { ...STORY_TEXT_DEFAULTS } };
  }
}