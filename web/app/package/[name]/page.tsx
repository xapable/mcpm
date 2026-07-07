import { notFound } from "next/navigation";
import { Download, User, Clock } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { getPackageData } from "@/lib/data";
import { StarButton } from "@/components/StarButton";
import { SetupButtons } from "./SetupButtons";
import { InstallButtons } from "@/components/InstallButtons";

interface PackagePageProps {
  params: { name: string };
}

function getClientConfig(name: string, meta: any) {
  const command = meta.command || "npx";
  const args = meta.args || ["-y", name];
  const hasEnv = meta.env && Object.keys(meta.env).length > 0;

  // Universal stdio config — works on ALL MCP clients (Claude, ChatGPT, Cursor, Windsurf, etc.)
  const stdio = { command, args, ...(hasEnv ? { env: meta.env } : {}) };
  const stdioWithType = { type: "stdio", ...stdio };

  return {
    universal: {
      mcpServers: { [name]: stdio },
    },
    universalTyped: {
      mcpServers: { [name]: stdioWithType },
    },
    mcpmSh: `mcpm install ${name}`,
    claudeCli: `claude mcp add --transport stdio ${name} -- ${command} ${args.join(" ")}`,
    cursorCli: `cursor mcp add ${name} -- ${command} ${args.join(" ")}`,
    codexCli: `codex mcp add ${name}`,
  };
}

const CLIENTS = [
  {
    id: "universal",
    name: "Universal",
    icon: "🔌",
    type: "json" as const,
    description: "Works with all MCP clients",
    paths: [
      { client: "Claude Desktop", path: "~/Library/Application Support/Claude/claude_desktop_config.json" },
      { client: "ChatGPT", path: "Settings → Integrations → MCP" },
      { client: "Cursor", path: "~/.cursor/mcp.json" },
      { client: "Windsurf", path: "~/.codeium/windsurf/mcp_config.json" },
      { client: "VS Code / Copilot", path: ".vscode/mcp.json" },
      { client: "Claude Code", path: ".mcp.json" },
      { client: "Gemini CLI", path: "~/.gemini/mcp.json" },
      { client: "Codex CLI", path: "~/.codex/mcp.json" },
      { client: "Continue", path: "~/.continue/config.json" },
      { client: "Cline / Roo Code", path: "Settings → MCP Servers" },
    ],
  },
  {
    id: "mcpmSh",
    name: "mcpm.sh",
    icon: "📦",
    type: "cmd" as const,
    description: "One command install",
  },
  {
    id: "claudeCli",
    name: "Claude Code CLI",
    icon: "💻",
    type: "cmd" as const,
    description: "Terminal command",
  },
];

export default async function PackagePage({ params }: PackagePageProps) {
  const pkg = await getPackageData(params.name);

  if (!pkg) {
    notFound();
  }

  const configs = getClientConfig(pkg.name, pkg.mcp || {});

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

      {/* One-click install buttons */}
      <div className="mt-6">
        <InstallButtons
          name={pkg.name}
          command={(pkg.mcp as any)?.command || "npx"}
          args={(pkg.mcp as any)?.args || ["-y", pkg.name]}
        />
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
