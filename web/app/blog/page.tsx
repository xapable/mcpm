import Link from "next/link";
import { getPaginatedPosts } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — mcpm",
  description: "Latest news, updates, and announcements from the mcpm team.",
};

const PER_PAGE = 10;

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || "1") || 1);
  const { posts, total, totalPages } = await getPaginatedPosts("blog", page, PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-slate-500 mb-10">
        News, updates, and announcements from mcpm. <span className="text-slate-300">({total} posts)</span>
      </p>

      {posts.length === 0 ? (
        <p className="text-slate-400">No posts yet. Check back soon!</p>
      ) : (
        <>
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
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {page > 1 ? (
                <Link
                  href={`/blog${page === 2 ? "" : `?page=${page - 1}`}`}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-300 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </span>
              )}
              <span className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-300 cursor-not-allowed">
                  Next <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
