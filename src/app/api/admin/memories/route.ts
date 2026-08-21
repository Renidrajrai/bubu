import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import { memoryCreateSchema } from "@/lib/memorySchemas";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const memories = await Memory.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ memories });
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
      location: input.location,
      category: input.category,
      sceneId: input.sceneId,
      slotId: input.sceneId ? input.slotId : null,
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
