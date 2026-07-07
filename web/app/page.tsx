import { getHomeData } from "@/lib/data";
import { getAllContent } from "@/lib/content";
import { formatNumber } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { PackageCard } from "@/components/PackageCard";
import {
  Package, Zap, Terminal, BookOpen, Code2,
  Upload, Puzzle, ArrowRight, ExternalLink, MessageCircle,
  Users, Sparkles, Github,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { stats, featured } = await getHomeData();
  const latestPosts = (await getAllContent()).slice(0, 3);

  const statsDisplay = [
    { value: formatNumber(stats.totalPackages), label: "Tools" },
    { value: formatNumber(stats.weeklyInstalls), label: "Weekly Installs" },
    { value: formatNumber(stats.totalUsers), label: "Publishers" },
    { value: formatNumber(stats.agentsBuilt), label: "Agents Built" },
  ];

  const clients = [
    { name: "Claude Desktop", desc: "Anthropic's AI assistant" },
    { name: "Cursor", desc: "AI-first code editor" },
    { name: "Windsurf", desc: "Agentic IDE" },
    { name: "mcpm.sh", desc: "CLI manager" },
  ];

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            The MCP<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              developer playground
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 leading-relaxed">
            Discover tools, share what you build, learn from the docs, and connect with MCP
            developers. The open community for AI agent tooling.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/publish"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25"
            >
              <Upload className="h-4 w-4" /> Share a Tool
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Read the Blog
            </Link>
            <Link
              href="https://github.com/xapable/mcpm/discussions"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Discuss
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ==================== COMMUNITY PULSE ==================== */}
      <section className="border-b border-slate-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Blog */}
            <Link href="/blog" className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Blog</h3>
              </div>
              <p className="text-sm text-slate-500">Community stories, updates, and deep dives into MCP tooling.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
                Read posts <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Docs */}
            <Link href="/tutorials" className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-white p-6 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Docs</h3>
              </div>
              <p className="text-sm text-slate-500">Step-by-step guides to build, publish, and scale your MCP tools.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:underline">
                Start learning <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Community */}
            <Link href="https://github.com/xapable/mcpm/discussions" target="_blank" className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-white p-6 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Community</h3>
              </div>
              <p className="text-sm text-slate-500">Ask questions, share ideas, and connect with MCP developers on GitHub.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-purple-600 group-hover:underline">
                Join discussions <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-8 text-center text-sm text-slate-500">
        mcpm — the open-source MCP community. Built by developers, for developers.
      </footer>
    </div>
  );
}
