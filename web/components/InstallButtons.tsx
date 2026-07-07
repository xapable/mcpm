"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Download } from "lucide-react";

interface InstallButtonsProps {
  name: string;
  command: string;
  args: string[];
}

const CLIENTS = [
  {
    id: "claude",
    name: "Add to Claude",
    icon: "🧠",
    gradient: "from-orange-400 to-orange-600",
    getCmd: (n: string, c: string, a: string[]) =>
      `claude mcp add --transport stdio ${n} -- ${c} ${a.join(" ")}`,
  },
  {
    id: "cursor",
    name: "Add to Cursor",
    icon: "⌨️",
    gradient: "from-purple-400 to-purple-600",
    getCmd: (n: string, c: string, a: string[]) =>
      `cursor mcp add ${n} -- ${c} ${a.join(" ")}`,
  },
  {
    id: "windsurf",
    name: "Add to Windsurf",
    icon: "🏄",
    gradient: "from-cyan-400 to-blue-600",
    getCmd: (n: string, c: string, a: string[]) =>
      `windsurf mcp add ${n} -- ${c} ${a.join(" ")}`,
  },
  {
    id: "chatgpt",
    name: "Add to ChatGPT",
    icon: "🤖",
    gradient: "from-green-400 to-emerald-600",
    getCmd: (_n: string, _c: string, _a: string[]) =>
      `Open ChatGPT → Settings → Integrations → MCP → Add server`,
  },
];

export function InstallButtons({ name, command, args }: InstallButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (clientId: string, getCmd: typeof CLIENTS[0]["getCmd"]) => {
    const text = getCmd(name, command, args);
    navigator.clipboard.writeText(text);
    setCopied(clientId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {CLIENTS.map((client) => {
        const cmd = client.getCmd(name, command, args);
        return (
          <div key={client.id} className="group relative">
            <button
              onClick={() => copy(client.id, client.getCmd)}
              className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${client.gradient} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            >
              <span className="text-lg">{client.icon}</span>
              {client.name}
              {copied === client.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4 opacity-70" />
              )}
            </button>
            <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10">
              <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-mono text-green-400 whitespace-nowrap shadow-xl">
                {cmd}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
