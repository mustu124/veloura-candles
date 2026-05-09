import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "velora_admin";

function secret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

export function signAdminSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSession(token?: string) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const valid = timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!valid) return false;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
  return data.exp > Date.now();
}

export async function isAdmin() {
  const store = await cookies();
  return verifyAdminSession(store.get(COOKIE)?.value);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
