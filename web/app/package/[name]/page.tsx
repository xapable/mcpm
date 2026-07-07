import { notFound } from "next/navigation";
import { Download, User, Clock } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { getPackageData } from "@/lib/data";
import { StarButton } from "@/components/StarButton";
import { SetupButtons } from "./SetupButtons";

interface PackagePageProps {
  params: { name: string };
}

function getClientConfig(name: string, meta: any) {
  const command = meta.command || "npx";
  const args = meta.args || ["-y", name];
  const env = meta.env || {};

  return {
    claude: {
      mcpServers: {
        [name]: { command, args, ...(Object.keys(env).length ? { env } : {}) },
      },
    },
    cursor: {
      mcpServers: {
        [name]: { command, args, ...(Object.keys(env).length ? { env } : {}) },
      },
    },
    windsurf: {
      mcpServers: {
        [name]: { command, args, ...(Object.keys(env).length ? { env } : {}) },
      },
    },
    vscode: {
      servers: {
        [name]: { type: "stdio", command, args, ...(Object.keys(env).length ? { env } : {}) },
      },
    },
  };
}

const CLIENTS = [
  { id: "claude", name: "Claude Desktop", icon: "🧠", path: "~/Library/Application Support/Claude/claude_desktop_config.json" },
  { id: "cursor", name: "Cursor", icon: "⌨️", path: "~/.cursor/mcp.json" },
  { id: "windsurf", name: "Windsurf", icon: "🏄", path: "~/.codeium/windsurf/mcp_config.json" },
  { id: "vscode", name: "VS Code", icon: "🟦", path: ".vscode/mcp.json" },
];

export default async function PackagePage({ params }: PackagePageProps) {
  const pkg = await getPackageData(params.name);

  if (!pkg) {
    notFound();
  }

  const configs = getClientConfig(pkg.name, {});

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

      {/* One-click setup */}
      <div className="mt-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-bold text-blue-900">⚡ Add to your MCP client</h2>
        <p className="mt-1 text-sm text-blue-700">Click a client to copy the config, then paste it into your settings.</p>
        <SetupButtons configs={configs} clients={CLIENTS} />
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
