import { db } from "@/db";
import { packages as pkgTable, versions, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getHomeData() {
  const stats = {
    totalPackages: (await db.select({ count: sql<number>`count(*)` }).from(pkgTable))[0].count,
    totalUsers: (await db.select({ count: sql<number>`count(*)` }).from(users))[0].count,
    weeklyInstalls: 45000, // TODO: compute from install events table
    agentsBuilt: 12000,
  };

  const featured = await db
    .select({
      name: pkgTable.name,
      description: pkgTable.description,
      downloads: pkgTable.downloads,
      createdAt: pkgTable.createdAt,
      username: users.username,
      avatar: users.image,
    })
    .from(pkgTable)
    .leftJoin(users, eq(pkgTable.userId, users.id))
    .orderBy(sql`downloads DESC`)
    .limit(6);

  return { stats, featured };
}

export async function getPackageData(name: string) {
  const rows = await db
    .select({
      name: pkgTable.name,
      description: pkgTable.description,
      repoUrl: pkgTable.repoUrl,
      downloads: pkgTable.downloads,
      createdAt: pkgTable.createdAt,
      userId: pkgTable.userId,
      username: users.username,
      avatar: users.image,
      mcp: pkgTable.mcp,
      version: versions.version,
      readme: versions.readme,
      versionCreatedAt: versions.createdAt,
    })
    .from(pkgTable)
    .leftJoin(users, eq(pkgTable.userId, users.id))
    .leftJoin(versions, eq(pkgTable.id, versions.packageId))
    .where(eq(pkgTable.name, name))
    .orderBy(sql`${versions.createdAt} DESC NULLS LAST`)
    .limit(1);

  if (rows.length === 0) return null;

  const pkg = rows[0];
  const allVersions = await db
    .select({ version: versions.version, createdAt: versions.createdAt })
    .from(versions)
    .innerJoin(pkgTable, eq(versions.packageId, pkgTable.id))
    .where(eq(pkgTable.name, name))
    .orderBy(sql`${versions.createdAt} DESC`);

  return {
    name: pkg.name,
    description: pkg.description ?? "",
    repoUrl: pkg.repoUrl,
    downloads: pkg.downloads ?? 0,
    createdAt: pkg.createdAt ?? new Date(),
    username: pkg.username ?? "unknown",
    avatar: pkg.avatar,
    version: pkg.version ?? "0.1.0",
    mcp: pkg.mcp,
    readme: pkg.readme ?? "",
    versions: allVersions,
  };
}

export async function getUserPackages(userId: string) {
  return db
    .select({
      name: pkgTable.name,
      description: pkgTable.description,
      downloads: pkgTable.downloads,
      createdAt: pkgTable.createdAt,
      username: users.username,
      avatar: users.image,
    })
    .from(pkgTable)
    .leftJoin(users, eq(pkgTable.userId, users.id))
    .where(eq(pkgTable.userId, userId))
    .orderBy(sql`downloads DESC`);
}
