import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

// In production, store tokens in DB with expiry
const tokenStore = new Map<string, { userId: string; username: string }>();

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const userId = (session.user as any).id;
  tokenStore.set(token, { userId, username: session.user.name || "unknown" });

  return NextResponse.json({ token });
}

// Verify token (used by other API routes)
export function verifyCliToken(token: string): { userId: string; username: string } | null {
  return tokenStore.get(token) || null;
}
