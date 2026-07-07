"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Github, ExternalLink } from "lucide-react";

interface QuickInstallProps {
  name: string;
  repoUrl?: string | null;
}

export function QuickInstall({ name, repoUrl }: QuickInstallProps) {
  const [copied, setCopied] = useState(false);

  const cliCmd = `mcpm-dev add ${name}`;

  const copyCli = () => {
    navigator.clipboard.writeText(cliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {/* CLI install */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500">
          <Terminal className="h-4 w-4" />
        </span>
        <code className="px-2 py-2 text-sm font-mono text-slate-800">{cliCmd}</code>
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

      {/* GitHub link */}
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Github className="h-4 w-4" />
          View on GitHub
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </a>
      )}
    </div>
  );
}
