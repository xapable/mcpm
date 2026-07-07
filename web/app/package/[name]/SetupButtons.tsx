"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface SetupButtonsProps {
  configs: Record<string, any>;
  clients: { id: string; name: string; icon: string; path: string }[];
}

export function SetupButtons({ configs, clients }: SetupButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (clientId: string) => {
    const config = configs[clientId];
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(clientId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {clients.map((client) => (
        <div key={client.id} className="group">
          <button
            onClick={() => copy(client.id)}
            className="w-full rounded-lg border border-blue-200 bg-white px-3 py-3 text-left transition-all hover:border-blue-400 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {client.icon} {client.name}
              </span>
              {copied === client.id ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400 truncate">{client.path}</p>
          </button>
        </div>
      ))}
    </div>
  );
}
