import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import cloudinary, { requireCloudinaryEnv } from "@/lib/cloudinary";
import { memoryUpdateSchema } from "@/lib/memorySchemas";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const parsed = memoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
    }
    const input = parsed.data;

    const update: Record<string, unknown> = {};
    for (const key of [
      "title", "caption", "category", "featured",
      "objectPosition", "displayMode",
    ] as const) {
      if (input[key] !== undefined) update[key] = input[key];
    }
    if (input.date !== undefined) update.date = input.date ? new Date(input.date) : null;
    if (input.visibility !== undefined) update.visibility = input.visibility;
    if (input.placement !== undefined) update.placement = input.placement;
    if (input.slot !== undefined) update.slot = input.slot;

    if (input.category !== undefined && input.slot != null) {
      await Memory.updateMany(
        { _id: { $ne: id }, category: input.category, slot: input.slot },
        { $set: { slot: null } }
      );
    }

    const memory = await Memory.findByIdAndUpdate(id, update, { returnDocument: "after" });
    if (!memory) return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    return NextResponse.json({ memory });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/memories PATCH]", err);
    return NextResponse.json({ error: "Could not update memory" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const memory = await Memory.findByIdAndDelete(id);
    if (!memory) return NextResponse.json({ error: "Memory not found" }, { status: 404 });

    if (memory.cloudinaryPublicId && !memory.cloudinaryPublicId.startsWith("placeholder/")) {
      try {
        requireCloudinaryEnv();
        await cloudinary.uploader.destroy(memory.cloudinaryPublicId, {
          resource_type: memory.mediaType === "video" ? "video" : "image",
        });
      } catch (err) {
        console.error("[admin/memories DELETE] cloudinary destroy:", err);
      }
    }
    await MediaAsset.deleteOne({ publicId: memory.cloudinaryPublicId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/memories DELETE]", err);
    return NextResponse.json({ error: "Could not delete memory" }, { status: 500 });
  }
}
