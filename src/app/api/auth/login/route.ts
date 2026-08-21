import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

// .env values containing `$` get mangled by Next's env expansion,
// so the bcrypt hash is stored hex-encoded and decoded here
function storedHash() {
  const hex = process.env.ADMIN_PASSWORD_HASH_HEX;
  return hex ? Buffer.from(hex, "hex").toString("binary") : undefined;
}

// ponytail: in-memory rate limit — fine for a single-admin site;
// move to Redis/upstash only if this ever gets deployed multi-instance
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 5 * 60 * 1000;

function tooManyAttempts(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const entry = attempts.get(ip);
  if (entry) entry.count += 1;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const hash = storedHash();
  if (
    !process.env.ADMIN_USERNAME ||
    !hash ||
    username !== process.env.ADMIN_USERNAME ||
    !(await bcrypt.compare(password, hash))
  ) {
    recordAttempt(ip);
    return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
