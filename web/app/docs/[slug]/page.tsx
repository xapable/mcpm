import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import { PostContent } from "@/components/PostContent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug, "tutorial");
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — mcpm Docs`,
    description: post.description,
  };
}

export default async function DocPage({ params }: Props) {
  const post = await getPost(params.slug, "tutorial");
  if (!post) notFound();

  return (
    <div className="max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
        {post.title}
      </h1>
      <PostContent html={post.html} />
    </div>
  );
}
