import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { MediaAsset } from "@/models/MediaAsset";
import cloudinary, { requireCloudinaryEnv } from "@/lib/cloudinary";

type BulkAction =
  | { action: "setVisibility"; visibility: "public" | "hidden" }
  | { action: "setFeatured"; featured: boolean }
  | { action: "setPlacement"; placement: "story" | "archive" }
  | { action: "delete" };

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as {
      ids?: string[];
      action?: BulkAction["action"];
    } & Record<string, unknown> | null;

    if (!body?.ids?.length || !body.action) {
      return NextResponse.json({ error: "ids and action required" }, { status: 400 });
    }

    const { ids, action, ...rest } = body;
    const filter = { _id: { $in: ids } };

    switch (action) {
      case "setVisibility": {
        await Memory.updateMany(filter, { visibility: rest.visibility });
        break;
      }
      case "setFeatured": {
        await Memory.updateMany(filter, { featured: rest.featured });
        break;
      }
      case "setPlacement": {
        await Memory.updateMany(filter, { placement: rest.placement });
        break;
      }
      case "delete": {
        const memories = await Memory.find(filter).lean();
        for (const m of memories) {
          if (m.cloudinaryPublicId && !m.cloudinaryPublicId.startsWith("placeholder/")) {
            try {
              requireCloudinaryEnv();
              await cloudinary.uploader.destroy(m.cloudinaryPublicId, {
                resource_type: m.mediaType === "video" ? "video" : "image",
              });
            } catch {
              // continue — memory is deleted even if Cloudinary fails
            }
          }
          await MediaAsset.deleteOne({ publicId: m.cloudinaryPublicId });
        }
        await Memory.deleteMany(filter);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/memories/bulk POST]", err);
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 });
  }
}
