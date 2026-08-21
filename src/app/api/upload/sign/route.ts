import { NextResponse } from "next/server";
import { createSignedUploadParams } from "@/lib/cloudinary";
import { signRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = signRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    return NextResponse.json(createSignedUploadParams(parsed.data.mediaType));
  } catch (err) {
    console.error("[upload/sign]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not sign upload" }, { status: 500 });
  }
}
