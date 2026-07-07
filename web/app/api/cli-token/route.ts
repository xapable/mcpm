import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { storeCliToken } from "@/lib/cli-auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const userId = (session.user as any).id;
  storeCliToken(token, { userId, username: session.user.name || "unknown" });

  return NextResponse.json({ token });
}
