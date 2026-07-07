import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Get GitHub access token from NextAuth accounts table
  const [account] = await db
    .select({ access_token: accounts.access_token })
    .from(accounts)
    .where(eq(accounts.userId, (session.user as any).id))
    .limit(1);

  if (!account?.access_token) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  // Fetch repos from GitHub
  const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
    headers: { Authorization: `Bearer ${account.access_token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }

  const repos = await res.json();
  const list = repos.map((r: any) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    url: r.html_url,
  }));

  return NextResponse.json(list);
}
