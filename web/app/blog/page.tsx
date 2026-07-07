import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — mcpm",
  description: "Latest news, updates, and announcements from the mcpm team.",
};

export default async function BlogPage() {
  const posts = await getAllPosts("blog");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-slate-500 mb-10">News, updates, and announcements from mcpm.</p>

      {posts.length === 0 ? (
        <p className="text-slate-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-slate-200 pb-8">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>·</span>
                <span>{post.author}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-500">{post.description}</p>
              </Link>
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
