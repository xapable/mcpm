import { db } from "@/db";
import { packages, users, versions } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyCliToken } from "@/lib/cli-auth";

// GET /api/packages?q=searchterm
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const data = await db
    .select({
      name: packages.name,
      description: packages.description,
      userId: packages.userId,
      repoUrl: packages.repoUrl,
      downloads: packages.downloads,
      createdAt: packages.createdAt,
      username: users.username,
      avatar: users.image,
    })
    .from(packages)
    .leftJoin(users, eq(packages.userId, users.id))
    .where(
      q
        ? or(
            like(packages.name, `%${q}%`),
            like(packages.description, `%${q}%`)
          )
        : undefined
    )
    .orderBy(packages.downloads)
    .limit(50);

  return NextResponse.json(data);
}

// POST /api/packages — publish (web session or CLI token)
export async function POST(req: NextRequest) {
  // Try session auth first, then CLI token
  const session = await getServerSession(authOptions);
  let userId: string;

  if (session?.user) {
    userId = (session.user as any).id;
  } else {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const cliUser = verifyCliToken(token);
    if (!cliUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    userId = cliUser.userId;
  }

  const body = await req.json();
  const { name, description, repoUrl, version, readme } = body;

  if (!name || !version) {
    return NextResponse.json({ error: "name and version required" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(packages)
    .where(eq(packages.name, name))
    .limit(1);

  if (existing.length > 0) {
    // Add new version to existing package
    await db.insert(versions).values({
      packageId: existing[0].id,
      version,
      readme: readme || "",
    });
    return NextResponse.json({ ok: true, name });
  }

  // New package
  const [pkg] = await db
    .insert(packages)
    .values({
      name,
      description: description || "",
      userId,
      repoUrl: repoUrl || "",
    })
    .returning();

  await db.insert(versions).values({
    packageId: pkg.id,
    version,
    readme: readme || "",
  });

  return NextResponse.json({ ok: true, name });
}
