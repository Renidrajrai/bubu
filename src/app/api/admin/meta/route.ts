import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Scene } from "@/models/Scene";
import { MediaAsset } from "@/models/MediaAsset";
import { STORY_SCENES } from "@/config/scenes";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const [scenes, assets] = await Promise.all([
      Scene.find().sort({ order: 1 }).lean(),
      MediaAsset.find().sort({ createdAt: -1 }).limit(200).lean(),
    ]);
    return NextResponse.json({
      scenes,
      storyConfig: STORY_SCENES,
      assets,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/meta GET]", err);
    return NextResponse.json({ error: "Could not load admin data" }, { status: 500 });
  }
}
