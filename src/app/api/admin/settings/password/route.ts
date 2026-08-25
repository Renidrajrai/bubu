import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = (await request.json().catch(() => null)) as {
      currentPassword?: string;
      newPassword?: string;
    } | null;

    if (!body?.currentPassword || !body?.newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required" },
        { status: 400 },
      );
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Verify current password
    const storedHash = process.env.ADMIN_PASSWORD_HASH_HEX;
    if (!storedHash) {
      return NextResponse.json({ error: "Password not configured" }, { status: 500 });
    }

    // The hash is stored as hex-encoded bcrypt hash
    const hashBytes = Buffer.from(storedHash, "hex").toString("utf8");
    const valid = await bcrypt.compare(body.currentPassword, hashBytes);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
    }

    // Hash new password and store as hex
    const newHash = await bcrypt.hash(body.newPassword, 12);
    const newHashHex = Buffer.from(newHash, "utf8").toString("hex");

    // In a real app you'd persist this to a database or env.
    // For now we return the new hash so the admin can update their .env.local
    return NextResponse.json({
      ok: true,
      message: "Password verified. Update ADMIN_PASSWORD_HASH_HEX in .env.local with the new hash.",
      newHashHex,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/settings/password PUT]", err);
    return NextResponse.json({ error: "Could not change password" }, { status: 500 });
  }
}
