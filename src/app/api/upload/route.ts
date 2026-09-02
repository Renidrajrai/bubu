import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { saveAssetSchema } from "@/lib/validations";
import { saveMediaAsset } from "@/lib/media";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => null);
    const parsed = saveAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid asset data" }, { status: 400 });
    }

    const asset = await saveMediaAsset(parsed.data);
    return NextResponse.json({ asset });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[upload/save]", err instanceof Error ? err.message : err);
    const message =
      err instanceof Error && err.message.includes("not found")
        ? "Asset not found on Cloudinary"
        : "Could not save asset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
