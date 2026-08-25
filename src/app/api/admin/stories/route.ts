import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { findSlot, STORY_SCENES } from "@/config/scenes";

// Assign memory to a story slot
export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as {
      memoryId?: string;
      sceneSlug?: string;
      slotId?: string;
    } | null;

    if (!body?.memoryId || !body?.sceneSlug || !body?.slotId) {
      return NextResponse.json(
        { error: "memoryId, sceneSlug, and slotId are required" },
        { status: 400 },
      );
    }

    // Validate scene/slot exist in config
    const slot = findSlot(body.sceneSlug, body.slotId);
    if (!slot) {
      return NextResponse.json(
        { error: "Invalid scene or slot combination" },
        { status: 400 },
      );
    }

    // Check memory exists
    const memory = await Memory.findById(body.memoryId);
    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    // Check if slot is already occupied (by a different memory)
    const existing = await Memory.findOne({
      sceneId: body.sceneSlug,
      slotId: body.slotId,
      _id: { $ne: body.memoryId },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "Slot already occupied",
          occupiedBy: { _id: String(existing._id), title: existing.title },
        },
        { status: 409 },
      );
    }

    // Assign
    await Memory.findByIdAndUpdate(body.memoryId, {
      sceneId: body.sceneSlug,
      slotId: body.slotId,
      placement: "story",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/stories POST]", err);
    return NextResponse.json({ error: "Could not assign slot" }, { status: 500 });
  }
}

// Remove memory from story slot
export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as {
      memoryId?: string;
    } | null;

    if (!body?.memoryId) {
      return NextResponse.json({ error: "memoryId required" }, { status: 400 });
    }

    await Memory.findByIdAndUpdate(body.memoryId, {
      sceneId: null,
      slotId: null,
      placement: "archive",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/stories DELETE]", err);
    return NextResponse.json({ error: "Could not remove from story" }, { status: 500 });
  }
}
