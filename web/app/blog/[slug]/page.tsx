import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/content";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug, "blog");
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — mcpm Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug, "blog");
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Blog
      </Link>
      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="text-4xl font-bold">{post.title}</h1>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className="prose prose-slate max-w-none
            prose-headings:font-semibold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-slate-900 prose-pre:text-slate-100
            prose-li:text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  );
}
