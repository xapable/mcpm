import Link from "next/link";
import { BookOpen, Code2, Terminal, Rocket, Puzzle, FileText } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import { PostMeta } from "@/lib/content";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = await getAllPosts("tutorial");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Documentation</h4>
            <nav className="space-y-0.5">
              {docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  {doc.title}
                </Link>
              ))}
              {docs.length === 0 && (
                <p className="text-sm text-slate-400 px-3">No docs yet.</p>
              )}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick links</h4>
              <div className="space-y-2">
                <Link href="/publish" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                  <Rocket className="h-3.5 w-3.5" /> Publish a tool
                </Link>
                <Link href="/blog" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                  <FileText className="h-3.5 w-3.5" /> Blog
                </Link>
                <Link href="https://github.com/xapable/mcpm/discussions" target="_blank" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                  <Code2 className="h-3.5 w-3.5" /> Community
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
