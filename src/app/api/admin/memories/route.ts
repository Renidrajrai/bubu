import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import { memoryCreateSchema } from "@/lib/memorySchemas";
import type { MemorySortOption } from "@/types/admin";

const SORT_MAP: Record<MemorySortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "title-asc": { title: 1 },
  "title-desc": { title: -1 },
  "story-order": { order: 1 },
  "date-taken": { date: -1 },
  "recently-updated": { updatedAt: -1 },
};

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const visibility = searchParams.get("visibility") || "all";
    const placement = searchParams.get("placement") || "all";
    const mediaType = searchParams.get("mediaType") || "all";
    const category = searchParams.get("category") || "";
    const sceneId = searchParams.get("sceneId") || "";
    const featured = searchParams.get("featured") || "";
    const sort = (searchParams.get("sort") as MemorySortOption) || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));

    const filter: Record<string, unknown> = {};

    if (visibility === "public" || visibility === "hidden") {
      filter.visibility = visibility;
    }
    if (placement === "story" || placement === "archive") {
      filter.placement = placement;
    }
    if (mediaType === "image" || mediaType === "video") {
      filter.mediaType = mediaType;
    }
    if (category) {
      filter.category = category;
    }
    if (sceneId) {
      filter.sceneId = sceneId;
    }
    if (featured === "true") {
      filter.featured = true;
    } else if (featured === "false") {
      filter.featured = false;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { caption: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const sortSpec = SORT_MAP[sort] || SORT_MAP.newest;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Memory.find(filter)
        .select("title thumbnailUrl mediaType visibility sceneId slotId placement featured category slot date createdAt")
        .sort(sortSpec)
        .skip(skip)
        .limit(limit)
        .lean(),
      Memory.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/memories GET]", err);
    return NextResponse.json({ error: "Could not load memories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json().catch(() => null);
    const parsed = memoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid memory data" }, { status: 400 });
    }
    const input = parsed.data;

    const asset = await MediaAsset.findOne({ publicId: input.publicId });
    if (!asset) {
      return NextResponse.json(
        { error: "Upload the media first (no asset record found)" },
        { status: 409 }
      );
    }

    const memory = await Memory.create({
      title: input.title,
      caption: input.caption,
      mediaType: asset.mediaType,
      cloudinaryPublicId: asset.publicId,
      cloudinaryUrl: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
      date: input.date ? new Date(input.date) : undefined,
      category: input.category,
      placement: input.placement,
      featured: input.featured,
      visibility: input.visibility,
      objectPosition: input.objectPosition,
      displayMode: input.displayMode,
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/memories POST]", err);
    return NextResponse.json({ error: "Could not create memory" }, { status: 500 });
  }
}
