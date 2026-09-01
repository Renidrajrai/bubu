import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";
import { STORY_TEXT_DEFAULTS } from "@/models/Settings";

// Editable editorial text — the single source of truth for all public copy.
async function getSettings() {
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = await Settings.create({});
    settings = settings.toObject();
  }
  if (!settings.storyText) {
    settings.storyText = { ...STORY_TEXT_DEFAULTS };
  }
  return settings;
}

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const settings = await getSettings();
    return NextResponse.json({ storyText: settings.storyText });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/storytext GET]", err);
    return NextResponse.json({ error: "Could not load story text" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    // Only accept known keys, coerce to plain strings.
    const update: Record<string, unknown> = {};
    for (const key of Object.keys(STORY_TEXT_DEFAULTS)) {
      if (typeof body[key] === "string") update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: Object.fromEntries(Object.entries(update).map(([k, v]) => [`storyText.${k}`, v])) },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ storyText: settings.storyText });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/storytext PUT]", err);
    return NextResponse.json({ error: "Could not save story text" }, { status: 500 });
  }
}
