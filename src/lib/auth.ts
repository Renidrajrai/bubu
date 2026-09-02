import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "pattu_session";
const SESSION_DAYS = 7;

function secret() {
  if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  // ponytail: in-memory denylist so a logged-out JWT dies immediately. Cleared
  // on restart; multi-instance would need a shared store — add only if scaled.
  if (revoked.has(token)) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.username === "string" ? { username: payload.username } : null;
  } catch {
    return null;
  }
}

const revoked = new Set<string>();
export function revokeSessionToken(token: string) {
  // bound the denylist to the session lifetime — matches SESSION_COOKIE_OPTIONS.maxAge
  setTimeout(() => revoked.delete(token), SESSION_DAYS * 24 * 60 * 60 * 1000).unref?.();
  revoked.add(token);
}

// server components / route handlers
export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

// .env values containing `$` get mangled by Next's env expansion, so the
// bcrypt hash is stored hex-encoded. The hash lives in the DB (so the admin
// can change it from the UI), falling back to the env seed until the first
// DB write exists.
export async function getAdminPasswordHashHex() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Settings } = await import("@/models/Settings");
    await connectDB();
    const doc = await Settings.findOne().lean();
    if (doc?.adminPasswordHashHex) return doc.adminPasswordHashHex as string;
  } catch (err) {
    console.error("[auth] failed to read admin password hash from DB", err);
  }
  return process.env.ADMIN_PASSWORD_HASH_HEX ?? undefined;
}

export async function setAdminPasswordHashHex(hex: string) {
  const { connectDB } = await import("@/lib/mongodb");
  const { Settings } = await import("@/models/Settings");
  await connectDB();
  await Settings.findOneAndUpdate({}, { adminPasswordHashHex: hex }, { upsert: true });
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

// Session cookie (no maxAge) — deleted by the browser on close, so admin
// asks for the password again each new session. The JWT keeps its own 7-day
// ceiling server-side, but the cookie won't outlive the browser session.
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
