import { NextResponse } from "next/server";
import { signAdminSession, setAdminCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await setAdminCookie(signAdminSession(email));
  return NextResponse.json({ ok: true });
}
