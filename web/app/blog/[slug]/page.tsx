import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/content";
import { PostContent } from "@/components/PostContent";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug, "blog");
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — mcpm Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug, "blog");
  if (!post) notFound();

  const readingTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Back to Blog
      </Link>
      <article>
        {/* Header */}
        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-slate-500">{post.description}</p>
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
            <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span className="text-slate-300">·</span>
            <span>{readingTime} min read</span>
            <span className="text-slate-300">·</span>
            <span>{post.author}</span>
          </div>
        </header>

        {/* Content with copy buttons */}
        <PostContent html={post.html} />
      </article>

      {/* Back */}
      <div className="mt-16 pt-8 border-t border-slate-200">
        <Link href="/blog" className="text-sm text-blue-600 hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
