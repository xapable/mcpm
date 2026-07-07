"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Github, Loader2, Copy, Check, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Repo {
  name: string; fullName: string; description: string; url: string;
}

export function GitHubImport() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [success, setSuccess] = useState<{ name: string } | null>(null);
  const [cliCopied, setCliCopied] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoadingRepos(true);
    fetch("/api/github-repos").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRepos(data);
    }).finally(() => setLoadingRepos(false));
  }, [session]);

  async function doImport(repoUrl: string) {
    setLoading(true); setError("");
    const res = await fetch("/api/packages/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess({ name: data.name });
    } else {
      setError(data.error || "Import failed");
    }
    setLoading(false);
  }

  const cliCmd = success ? `mcpm-dev add ${success.name}` : "";

  const copyCli = () => {
    navigator.clipboard.writeText(cliCmd);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  // Success state
  if (success) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Check className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold text-slate-900">Published!</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          <strong>{success.name}</strong> is now live on mcpm. Your users can install it with:
        </p>
        <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden mb-4">
          <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 shrink-0">
            <Terminal className="h-4 w-4" />
          </span>
          <code className="flex-1 px-2 py-2 text-sm font-mono text-slate-800">{cliCmd}</code>
          <button
            onClick={copyCli}
            className="flex items-center gap-1.5 border-l border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
          >
            {cliCopied ? (
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
        <Link
          href={`/package/${success.name}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          View package page <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="h-5 w-5 text-blue-600" /><h2 className="font-semibold text-slate-900">Import from GitHub</h2>
      </div>

      {session ? (
        <div>
          <p className="text-sm text-slate-500 mb-3">Select a repository to import.</p>
          {loadingRepos ? (
            <div className="flex items-center gap-2 text-sm text-slate-400 py-4"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
          ) : repos.length > 0 ? (
            <div className="space-y-3">
              <select value={selectedRepo} onChange={e => setSelectedRepo(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="">Select a repository...</option>
                {repos.map(r => <option key={r.fullName} value={r.url}>{r.fullName}{r.description ? ` — ${r.description.slice(0,60)}` : ""}</option>)}
              </select>
              <button onClick={() => selectedRepo && doImport(selectedRepo)} disabled={loading || !selectedRepo}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} Import
              </button>
            </div>
          ) : <p className="text-sm text-slate-400">No repositories found.</p>}
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-500 mb-4">Paste your GitHub repo URL.</p>
          <form onSubmit={e => { e.preventDefault(); url && doImport(url); }} className="flex gap-2">
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/you/your-mcp-tool"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            <button type="submit" disabled={loading || !url}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} Import
            </button>
          </form>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
