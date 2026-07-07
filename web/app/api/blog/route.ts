import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, desc, or, like, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog — list posts
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
      type: posts.type,
      tags: posts.tags,
      createdAt: posts.createdAt,
      username: users.username,
      avatar: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(
      q
        ? or(like(posts.title, `%${q}%`), like(posts.description, `%${q}%`))
        : undefined
    )
    .orderBy(desc(posts.createdAt))
    .limit(tag ? 50 : 20);

  // Filter by tag (PostgreSQL array contains)
  const filtered = tag
    ? rows.filter((r) => r.tags?.includes(tag))
    : rows;

  return NextResponse.json(filtered);
}

// POST /api/blog — create post (authenticated)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to publish" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, content, tags, slug, type } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "title and slug required" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  // Check slug uniqueness
  const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const [post] = await db.insert(posts).values({
    title,
    slug,
    type: type || "blog",
    description: description || "",
    content: content || "",
    tags: tags || [],
    userId,
  }).returning();

  return NextResponse.json(post, { status: 201 });
}
