import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { createSignedUploadParams } from "@/lib/cloudinary";
import { signRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => null);
    const parsed = signRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    return NextResponse.json(createSignedUploadParams(parsed.data.mediaType));
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[upload/sign]", err instanceof Error ? err.message : err);
    console.error("[upload/sign]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not sign upload" }, { status: 500 });
  }
}
