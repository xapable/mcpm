import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { packages, users, versions } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  const rows = await db
    .select({
      name: packages.name,
      description: packages.description,
      repoUrl: packages.repoUrl,
      downloads: packages.downloads,
      mcp: sql<string>`${packages.mcp}`,
      createdAt: packages.createdAt,
      username: users.username,
      version: versions.version,
      readme: versions.readme,
    })
    .from(packages)
    .leftJoin(users, eq(packages.userId, users.id))
    .leftJoin(versions, eq(packages.id, versions.packageId))
    .where(eq(packages.name, name))
    .orderBy(desc(versions.createdAt))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
