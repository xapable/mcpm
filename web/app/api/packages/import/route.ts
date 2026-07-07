import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyCliToken } from "@/lib/cli-auth";
import { db } from "@/db";
import { packages, versions } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/packages/import — import from GitHub URL
export async function POST(req: NextRequest) {
  // Auth
  let userId: string;
  const session = await getServerSession(authOptions);
  if (session?.user) {
    userId = (session.user as any).id;
  } else {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Sign in to import" }, { status: 401 });
    const cliUser = await verifyCliToken(token);
    if (!cliUser) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    userId = cliUser.userId;
  }

  const { repoUrl } = await req.json();
  if (!repoUrl) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });

  // Parse GitHub URL: https://github.com/owner/repo
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s#]+)/);
  if (!match) return NextResponse.json({ error: "Invalid GitHub URL. Use: https://github.com/owner/repo" }, { status: 400 });

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");

  // Fetch package.json from GitHub
  let pkg: any;
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/package.json`
    );
    if (!res.ok) throw new Error("package.json not found");
    pkg = await res.json();
  } catch {
    return NextResponse.json({ error: "Could not fetch package.json. Make sure the repo has one on main branch." }, { status: 400 });
  }

  if (!pkg.name) return NextResponse.json({ error: "package.json must have a name field" }, { status: 400 });

  const name = pkg.name;
  const description = pkg.description || "";
  const version = pkg.version || "1.0.0";

  // Fetch README from GitHub (try multiple paths)
  let readme = "";
  const readmePaths = ["README.md", "readme.md", "README", "docs/README.md"];
  for (const rp of readmePaths) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${rp}`
      );
      if (res.ok) { readme = await res.text(); break; }
    } catch { /* try next */ }
  }

  // Check if package already exists
  const existing = await db.select().from(packages).where(eq(packages.name, name)).limit(1);

  if (existing.length > 0) {
    // Update + add version
    if (existing[0].userId !== userId) {
      return NextResponse.json({ error: "Package name taken by another user" }, { status: 403 });
    }
    await db.update(packages).set({ description, repoUrl }).where(eq(packages.name, name));
    await db.insert(versions).values({ packageId: existing[0].id, version, readme });
  } else {
    // New package
    const [newPkg] = await db.insert(packages).values({ name, description, userId, repoUrl }).returning();
    await db.insert(versions).values({ packageId: newPkg.id, version, readme });
  }

  return NextResponse.json({ ok: true, name, url: `https://www.mcpm.dev/package/${name}` });
}
