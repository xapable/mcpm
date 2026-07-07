import { db } from "@/db";
import { packages, versions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/packages/[name]/versions
export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  const pkg = await db.query.packages.findFirst({
    where: (p, { eq }) => eq(p.name, name),
  });

  if (!pkg) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const vers = await db
    .select({
      version: versions.version,
      createdAt: versions.createdAt,
      readme: versions.readme,
    })
    .from(versions)
    .where(eq(versions.packageId, pkg.id))
    .orderBy(versions.createdAt);

  return NextResponse.json(vers);
}
