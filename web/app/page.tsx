import { getHomeData } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { PackageCard } from "@/components/PackageCard";
import { Package, Globe, Zap, Terminal } from "lucide-react";

export default async function HomePage() {
  const { stats, featured } = await getHomeData();

  const statsDisplay = [
    { value: formatNumber(stats.totalPackages), label: "Tools" },
    { value: formatNumber(stats.weeklyInstalls), label: "Weekly Installs" },
    { value: formatNumber(stats.totalUsers), label: "Publishers" },
    { value: formatNumber(stats.agentsBuilt), label: "Agents Built" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            The package manager for{" "}
            <span className="text-blue-600">AI agents</span>
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Discover, publish, and install MCP tools. Give your agents superpowers.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Terminal className="h-4 w-4" />
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
              mcpm-cli add weather-mcp
            </code>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {statsDisplay.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured packages */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-slate-900">Featured tools</h2>
          {featured.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <PackageCard key={pkg.name} {...pkg} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-slate-500">No packages published yet.</p>
              <p className="mt-1 text-sm text-slate-400">
                Be the first to{" "}
                <a href="/publish" className="text-blue-600 hover:underline">
                  publish an MCP tool
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: Package, title: "Publish", desc: "Wrap any API as an MCP tool. One command to publish." },
              { icon: Globe, title: "Discover", desc: "Search the registry. Find tools for any task." },
              { icon: Zap, title: "Install", desc: "One command. Your agent has a new capability." },
            ].map((step) => (
              <div key={step.title} className="rounded-xl bg-white p-6 shadow-sm">
                <step.icon className="mx-auto h-8 w-8 text-blue-600" />
                <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
        mcpm — the open-source MCP registry. Built for the agent era.
      </footer>
    </div>
  );
}
