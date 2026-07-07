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
      avatar: users.avatar,
    })
    .from(pkgTable)
    .leftJoin(users, eq(pkgTable.userId, users.id))
    .orderBy(sql`downloads DESC`)
    .limit(6);

  return { stats, featured };
}

export async function getPackageData(name: string) {
  const pkg = await db.query.packages.findFirst({
    where: (p, { eq }) => eq(p.name, name),
    with: {
      versions: { orderBy: (v: typeof versions.$inferSelect, { desc }) => [desc(v.createdAt)] },
    },
  });

  if (!pkg) return null;

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, pkg.userId),
  });

  return {
    name: pkg.name,
    description: pkg.description,
    repoUrl: pkg.repoUrl,
    downloads: pkg.downloads,
    createdAt: pkg.createdAt,
    username: user?.username || "unknown",
    avatar: user?.avatar,
    version: pkg.versions[0]?.version || "0.1.0",
    readme: pkg.versions[0]?.readme || "",
    versions: pkg.versions.map((v) => ({
      version: v.version,
      createdAt: v.createdAt,
    })),
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
      avatar: users.avatar,
    })
    .from(pkgTable)
    .leftJoin(users, eq(pkgTable.userId, users.id))
    .where(eq(pkgTable.userId, userId))
    .orderBy(sql`downloads DESC`);
}
