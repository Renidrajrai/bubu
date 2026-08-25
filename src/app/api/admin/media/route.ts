import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { Memory } from "@/models/Memory";
import cloudinary, { requireCloudinaryEnv } from "@/lib/cloudinary";

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as {
      publicId?: string;
    } | null;

    if (!body?.publicId) {
      return NextResponse.json({ error: "publicId required" }, { status: 400 });
    }

    // Check it's not referenced by any memory
    const referenced = await Memory.findOne({ cloudinaryPublicId: body.publicId });
    if (referenced) {
      return NextResponse.json(
        { error: "Asset is still used by a memory. Delete the memory first." },
        { status: 409 },
      );
    }

    // Delete from Cloudinary
    try {
      requireCloudinaryEnv();
      const asset = await MediaAsset.findOne({ publicId: body.publicId });
      const resourceType = asset?.mediaType === "video" ? "video" : "image";
      await cloudinary.uploader.destroy(body.publicId, { resource_type: resourceType });
    } catch (err) {
      console.error("[admin/media DELETE] cloudinary destroy:", err);
    }

    // Delete asset record
    await MediaAsset.deleteOne({ publicId: body.publicId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/media DELETE]", err);
    return NextResponse.json({ error: "Could not delete asset" }, { status: 500 });
  }
}
