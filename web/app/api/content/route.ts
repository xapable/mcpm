import { NextResponse, NextRequest } from "next/server";
import { getAllPosts, getAllContent, searchPosts, createPost } from "@/lib/content";
import { verifyCliToken } from "@/lib/cli-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") as "blog" | "tutorial" | null;

  if (q) {
    return NextResponse.json(await searchPosts(q));
  }

  if (type === "blog") {
    return NextResponse.json(await getAllPosts("blog"));
  }

  if (type === "tutorial") {
    return NextResponse.json(await getAllPosts("tutorial"));
  }

  return NextResponse.json(await getAllContent());
}

/** Create a new blog post or tutorial (requires Bearer auth) */
export async function POST(request: NextRequest) {
  // Authenticate via Bearer token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized — missing Bearer token" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const user = await verifyCliToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized — invalid or expired token" }, { status: 401 });
  }

  // Parse body
  const body = await request.json();
  const { type, title, description, tags, slug, content } = body;

  if (!type || (type !== "blog" && type !== "tutorial")) {
    return NextResponse.json({ error: "Invalid type. Must be 'blog' or 'tutorial'" }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Only admin can create tutorials
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "xapable";
  if (type === "tutorial" && user.username !== ADMIN_USERNAME) {
    return NextResponse.json({ error: "Forbidden — only admin can create tutorials" }, { status: 403 });
  }

  const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  try {
    const post = await createPost(type, postSlug, (user as any).id, {
      title,
      description: description || "",
      tags: tags || [],
      content: content || "",
    });

    return NextResponse.json({
      success: true,
      slug: postSlug,
      url: `https://www.mcpm.dev/${type === "blog" ? "blog" : "tutorials"}/${postSlug}`,
      post,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create post" }, { status: 500 });
  }
}
