import { db } from "@/db";
import { packages, users } from "@/db/schema";
import { eq, like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/search?q=weather&limit=20
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

  const baseQuery = db
    .select({
      name: packages.name,
      description: packages.description,
      downloads: packages.downloads,
      username: users.username,
      avatar: users.image,
      createdAt: packages.createdAt,
    })
    .from(packages)
    .leftJoin(users, eq(packages.userId, users.id));

  let data;
  if (q && q.length >= 1) {
    data = await baseQuery
      .where(
        or(
          like(packages.name, `%${q}%`),
          like(packages.description, `%${q}%`)
        )
      )
      .orderBy(packages.downloads)
      .limit(limit);
  } else {
    // No query — return all packages, newest first
    data = await baseQuery
      .orderBy(sql`${packages.createdAt} DESC`)
      .limit(limit);
  }

  return NextResponse.json(data);
}
