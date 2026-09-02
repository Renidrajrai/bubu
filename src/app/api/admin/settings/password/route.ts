import { NextResponse } from "next/server";
import {
  requireAdmin,
  UnauthorizedError,
  getAdminPasswordHashHex,
  setAdminPasswordHashHex,
} from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    await requireAdmin();

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
    const storedHashHex = await getAdminPasswordHashHex();
    if (!storedHashHex) {
      return NextResponse.json({ error: "Password not configured" }, { status: 500 });
    }

    const storedHash = Buffer.from(storedHashHex, "hex").toString("utf8");
    const valid = await bcrypt.compare(body.currentPassword, storedHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
    }

    // Hash new password, store as hex in the DB so login picks it up immediately
    const newHash = await bcrypt.hash(body.newPassword, 12);
    await setAdminPasswordHashHex(Buffer.from(newHash, "utf8").toString("hex"));

    return NextResponse.json({ ok: true, message: "Password changed" });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[admin/settings/password PUT]", err);
    return NextResponse.json({ error: "Could not change password" }, { status: 500 });
  }
}
