import { db } from "@/db";
import { packages, users } from "@/db/schema";
import { eq, like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/search?q=weather&limit=5
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const data = await db
    .select({
      name: packages.name,
      description: packages.description,
      downloads: packages.downloads,
      username: users.username,
      avatar: users.avatar,
    })
    .from(packages)
    .leftJoin(users, eq(packages.userId, users.id))
    .where(
      or(
        like(packages.name, `%${q}%`),
        like(packages.description, `%${q}%`)
      )
    )
    .orderBy(packages.downloads)
    .limit(limit);

  return NextResponse.json(data);
}
