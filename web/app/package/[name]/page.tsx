import { Download, User, Clock, ExternalLink, Copy, Check } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { StarButton } from "@/components/StarButton";

interface PackagePageProps {
  params: { name: string };
}

export default function PackagePage({ params }: PackagePageProps) {
  const name = params.name;

  // Mock data — replace with DB query
  const pkg = {
    name,
    description: "Get real-time weather forecasts for any city worldwide. Supports current conditions, hourly forecasts, and 7-day outlooks.",
    username: "anthropic",
    avatar: null,
    downloads: 12400,
    createdAt: new Date("2025-06-15"),
    version: "1.2.0",
    repoUrl: "https://github.com/anthropic/weather-mcp",
    readme: `# weather-mcp

A Model Context Protocol server for weather data.

## Installation

\`\`\`bash
mcpm add weather-mcp
\`\`\`

## Usage

Add to your agent:

\`\`\`typescript
import { weatherMcp } from "weather-mcp";

const agent = new Agent({
  tools: [weatherMcp],
});
\`\`\`

## Available Tools

- **get_current_weather** — Get current conditions for a city
- **get_forecast** — 7-day forecast with temps, humidity, wind
- **get_alerts** — Severe weather alerts for a region`,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pkg.name}</h1>
          <p className="mt-2 text-lg text-slate-500">{pkg.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {pkg.username}
            </span>
            <span>v{pkg.version}</span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" /> {formatNumber(pkg.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {timeAgo(pkg.createdAt)}
            </span>
          </div>
        </div>
        <StarButton packageName={pkg.name} />
      </div>

      {/* Install command */}
      <div className="mt-8 rounded-xl border border-slate-300 bg-slate-900 p-4">
        <p className="mb-2 text-xs text-slate-400">Install</p>
        <code className="text-lg text-green-400">$ mcpm add {pkg.name}</code>
      </div>

      {/* README */}
      <div className="mt-10 rounded-xl border border-slate-200 p-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">README</h2>
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700 font-mono">
            {pkg.readme}
          </pre>
        </div>
      </div>
    </div>
  );
}
