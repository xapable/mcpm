import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { packages, users, versions } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { verifyCliToken } from "@/lib/cli-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

// DELETE /api/packages/:name — only package owner can delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  // Auth: session or CLI token
  let userId: string;
  const session = await getServerSession(authOptions);
  if (session?.user) {
    userId = (session.user as any).id;
  } else {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const cliUser = await verifyCliToken(token);
    if (!cliUser) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    userId = cliUser.userId;
  }

  // Find package
  const [pkg] = await db.select().from(packages).where(eq(packages.name, params.name)).limit(1);
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  // Only owner
  if (pkg.userId !== userId) {
    return NextResponse.json({ error: "Only the package owner can delete" }, { status: 403 });
  }

  // Delete versions first, then package
  await db.delete(versions).where(eq(versions.packageId, pkg.id));
  await db.delete(packages).where(eq(packages.id, pkg.id));

  return NextResponse.json({ ok: true, deleted: params.name });
}
