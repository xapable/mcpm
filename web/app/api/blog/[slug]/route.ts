import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
      content: posts.content,
      tags: posts.tags,
      createdAt: posts.createdAt,
      username: users.username,
      avatar: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.slug, params.slug))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
