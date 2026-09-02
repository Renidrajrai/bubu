import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject();
    }
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/settings GET]", err);
    return NextResponse.json({ error: "Could not load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const allowed = ["siteTitle", "introText", "archiveEnabled", "storyEnabled", "defaultDisplayMode", "defaultObjectPosition"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      const val = body[key];
      if (val === undefined) continue;
      if (key === "archiveEnabled" || key === "storyEnabled") {
        update[key] = val === true || val === "true";
      } else if (typeof val === "string") {
        update[key] = key === "introText" || key === "siteTitle" ? val.trim() : val;
      } else {
        update[key] = val;
      }
    }

    const settings = await Settings.findOneAndUpdate({}, update, { upsert: true, returnDocument: "after" });
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/settings PUT]", err);
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
  }
}
