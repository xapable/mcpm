import { db } from "@/db";
import { stars } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// POST /api/packages/[name]/star — toggle star
export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { name } = params;

  // Find package
  const pkg = await db.query.packages.findFirst({
    where: (p, { eq }) => eq(p.name, name),
  });

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  // Check if already starred
  const existing = await db
    .select()
    .from(stars)
    .where(and(eq(stars.userId, userId), eq(stars.packageId, pkg.id)))
    .limit(1);

  if (existing.length > 0) {
    // Unstar
    await db.delete(stars).where(eq(stars.id, existing[0].id));
    return NextResponse.json({ starred: false });
  }

  // Star
  await db.insert(stars).values({ userId, packageId: pkg.id });
  return NextResponse.json({ starred: true });
}

// GET /api/packages/[name]/star — check star status
export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ starred: false, count: 0 });
  }

  const userId = (session.user as any).id;
  const { name } = params;

  const pkg = await db.query.packages.findFirst({
    where: (p, { eq }) => eq(p.name, name),
  });

  if (!pkg) {
    return NextResponse.json({ starred: false, count: 0 });
  }

  const [starRow] = await db
    .select()
    .from(stars)
    .where(and(eq(stars.userId, userId), eq(stars.packageId, pkg.id)))
    .limit(1);

  const count = await db
    .select()
    .from(stars)
    .where(eq(stars.packageId, pkg.id));

  return NextResponse.json({
    starred: starRow ? true : false,
    count: count.length,
  });
}
