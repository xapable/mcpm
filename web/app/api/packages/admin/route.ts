import { db } from "@/db";
import { packages, users, versions, stars } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const totalPackages = await db.select({ count: sql<number>`count(*)` }).from(packages);
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalStars = await db.select({ count: sql<number>`count(*)` }).from(stars);

  const topPackages = await db
    .select({
      name: packages.name,
      downloads: packages.downloads,
      username: users.username,
      versionCount: sql<number>`count(${versions.id})`,
      starCount: sql<number>`count(${stars.id})`,
    })
    .from(packages)
    .leftJoin(users, eq(packages.userId, users.id))
    .leftJoin(versions, eq(packages.id, versions.packageId))
    .leftJoin(stars, eq(packages.id, stars.packageId))
    .groupBy(packages.id, users.username)
    .orderBy(sql`downloads DESC`)
    .limit(20);

  return NextResponse.json({
    stats: {
      totalPackages: totalPackages[0].count,
      totalUsers: totalUsers[0].count,
      totalStars: totalStars[0].count,
    },
    topPackages,
  });
}
