import { getHomeData } from "@/lib/data";
import { getAllContent } from "@/lib/content";
import { formatNumber } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { PackageCard } from "@/components/PackageCard";
import {
  Package, Globe, Zap, Terminal, BookOpen, Code2,
  Upload, Puzzle, ArrowRight, ExternalLink,
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-4 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <Zap className="h-3.5 w-3.5" />
            The open-source MCP registry
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Build MCP tools.
            <br />
            <span className="text-blue-400">Deploy everywhere.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            The developer platform for Model Context Protocol. Publish once, run on Claude,
            Cursor, Windsurf, and any MCP client.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/publish"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Start Publishing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
            >
              Read the Guide <BookOpen className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex justify-center">
            <SearchBar />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Terminal className="h-4 w-4" />
            <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-slate-300">
              mcpm-dev add weather-mcp
            </code>
          </div>
        </div>
      </section>

      {/* ==================== WHAT IS MCP ==================== */}
      <section className="border-b border-slate-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                What is <span className="text-blue-600">MCP</span>?
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                The <strong>Model Context Protocol</strong> lets AI agents connect to external tools
                and APIs — like giving your agent access to Stripe, Slack, GitHub, or any service
                with an API.
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Think of MCP tools as <strong>npm packages for AI agents</strong>. mcpm is the
                registry where you discover, publish, and share them.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/blog" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
                <Link href="/tutorials" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                  View tutorials <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="h-4 w-4" />
                  <span>Your MCP-powered agent</span>
                </div>
                <div className="rounded bg-slate-900 p-4 text-green-400">
                  <span className="text-slate-500">{"> "}</span>
                  <span className="text-white">mcpm-dev add stripe-mcp</span>
                  <br />
                  <span className="text-slate-400">✓ Installed stripe-mcp v1.0.0</span>
                  <br />
                  <br />
                  <span className="text-slate-500">{"> "}</span>
                  <span className="text-white">Create an invoice for $49</span>
                  <br />
                  <span className="text-blue-400">✓ Invoice #INV-042 created</span>
                  <br />
                  <span className="text-blue-400">→ https://pay.stripe.com/inv_xxx</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DEVELOPER JOURNEY ==================== */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Your MCP journey</h2>
          <p className="mt-3 text-slate-500">From zero to production in three steps.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Code2,
                step: "1",
                title: "Build",
                desc: "Create an MCP tool wrapping any API. Use our starter templates or bring your own.",
                link: "/tutorials",
                linkText: "Start building",
              },
              {
                icon: Upload,
                step: "2",
                title: "Publish",
                desc: "One command deploys your tool to the registry. Version it, document it, share it.",
                link: "/publish",
                linkText: "Publish a tool",
              },
              {
                icon: Puzzle,
                step: "3",
                title: "Integrate",
                desc: "Your tool works everywhere — Claude Desktop, Cursor, Windsurf, and any MCP client.",
                link: "/tutorials/publish-first-mcp-tool",
                linkText: "See integration guide",
              },
            ].map((item) => (
              <div key={item.title} className="group relative rounded-2xl bg-white p-8 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="absolute top-4 right-4 text-5xl font-bold text-slate-100 group-hover:text-blue-50 transition-colors select-none">
                  {item.step}
                </div>
                <h3 className="relative text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="relative mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                <Link href={item.link} className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                  {item.linkText} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CLIENT COMPATIBILITY ==================== */}
      <section className="border-y border-slate-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Works with every MCP client</h2>
          <p className="mt-2 text-slate-500">Publish once. Your tools work everywhere MCP is supported.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {clients.map((client) => (
              <div key={client.name} className="rounded-xl border border-slate-200 bg-slate-50 p-6 hover:border-blue-200 transition-colors">
                <p className="font-semibold text-slate-900">{client.name}</p>
                <p className="mt-1 text-xs text-slate-400">{client.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS + LATEST ==================== */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Stats */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Growing ecosystem</h2>
              <div className="mt-6 grid grid-cols-2 gap-6">
                {statsDisplay.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-200 p-6 text-center">
                    <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest from blog */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Latest from the blog</h2>
                <Link href="/blog" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {latestPosts.length === 0 ? (
                  <p className="text-slate-400 text-sm">No posts yet. Check back soon!</p>
                ) : (
                  latestPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/${post.type === "blog" ? "blog" : "tutorials"}/${post.slug}`}
                      className="block rounded-lg border border-slate-200 p-4 hover:border-blue-200 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 uppercase">
                          {post.type}
                        </span>
                        <span className="text-xs text-slate-400">{post.date}</span>
                      </div>
                      <h3 className="mt-1 font-semibold text-slate-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{post.description}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED TOOLS ==================== */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Featured tools</h2>
            <Link href="/search" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
              Browse all <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <PackageCard key={pkg.name} {...pkg} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-slate-500">No packages published yet.</p>
              <Link href="/publish" className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                Be the first to publish <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-slate-900 px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to ship your MCP tool?</h2>
        <p className="mt-3 text-slate-400 max-w-md mx-auto">
          Join developers building the future of AI agents. Publish your first tool in minutes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/publish"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Publish a Tool <Upload className="h-4 w-4" />
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 font-medium text-slate-200 hover:border-slate-500 transition-colors"
          >
            View Tutorials <BookOpen className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-8 text-center text-sm text-slate-500">
        mcpm — the open-source MCP registry. Built for the agent era.
      </footer>
    </div>
  );
}
