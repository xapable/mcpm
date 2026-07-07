"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface QuickInstallProps {
  name: string;
}

export function QuickInstall({ name }: QuickInstallProps) {
  const [copied, setCopied] = useState(false);

  const cliCmd = `mcpm-dev add ${name}`;

  const copyCli = () => {
    navigator.clipboard.writeText(cliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 shrink-0">
          <Terminal className="h-4 w-4" />
        </span>
        <code className="flex-1 px-2 py-2 text-sm font-mono text-slate-800">{cliCmd}</code>
        <button
          onClick={copyCli}
          className="flex items-center gap-1.5 border-l border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
