import { NextResponse } from "next/server";
import { getAllPosts, getAllContent, searchPosts } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") as "blog" | "tutorial" | null;

  if (q) {
    return NextResponse.json(searchPosts(q));
  }

  if (type === "blog") {
    return NextResponse.json(getAllPosts("blog"));
  }

  if (type === "tutorial") {
    return NextResponse.json(getAllPosts("tutorial"));
  }

  return NextResponse.json(getAllContent());
}
