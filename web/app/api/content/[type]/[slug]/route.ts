import { NextRequest, NextResponse } from "next/server";
import { getPost } from "@/lib/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string; slug: string } }
) {
  const { type, slug } = params;

  if (type !== "blog" && type !== "tutorials") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const contentType = type === "blog" ? "blog" : "tutorial";
  const post = await getPost(slug, contentType);

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
