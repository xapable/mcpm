"use client";

import { useState } from "react";
import { Copy, Check, Terminal, FileJson, ChevronDown, ChevronUp } from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  icon: string;
  type: "json" | "cmd";
  description: string;
  paths?: { client: string; path: string }[];
}

interface SetupButtonsProps {
  configs: Record<string, any>;
  clients: ClientInfo[];
}

export function SetupButtons({ configs, clients }: SetupButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(clients[0]?.id || "");
  const [showPaths, setShowPaths] = useState(true);

  const copy = (clientId: string) => {
    const config = configs[clientId];
    const text = typeof config === "string" ? config : JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(clientId);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeClient = clients.find((c) => c.id === activeTab);
  const activeConfig = configs[activeTab];

  return (
    <div className="mt-4">
      {/* Client tabs */}
      <div className="flex flex-wrap gap-2">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => setActiveTab(client.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === client.id
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"
            }`}
          >
            <span>{client.icon}</span>
            {client.name}
          </button>
        ))}
      </div>

      {/* Config display */}
      {activeClient && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {activeClient.type === "cmd" ? (
                <Terminal className="h-3.5 w-3.5" />
              ) : (
                <FileJson className="h-3.5 w-3.5" />
              )}
              <span>{activeClient.description}</span>
            </div>
            <button
              onClick={() => copy(activeTab)}
              className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {copied === activeTab ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 text-sm text-green-400 font-mono leading-relaxed">
            <code>
              {typeof activeConfig === "string"
                ? activeConfig
                : JSON.stringify(activeConfig, null, 2)}
            </code>
          </pre>

          {/* Client file paths (only for universal JSON config) */}
          {activeClient.paths && (
            <div className="border-t border-slate-700">
              <button
                onClick={() => setShowPaths(!showPaths)}
                className="flex w-full items-center justify-between px-4 py-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                <span>📍 Where to paste this config</span>
                {showPaths ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              {showPaths && (
                <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeClient.paths.map((p) => (
                    <div
                      key={p.client}
                      className="flex items-center justify-between rounded px-2 py-1 text-xs bg-slate-800"
                    >
                      <span className="text-slate-300">{p.client}</span>
                      <code className="text-slate-500 ml-2 truncate max-w-[180px]">
                        {p.path}
                      </code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
