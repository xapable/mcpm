"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Loader2, Check } from "lucide-react";

export function GitHubImport() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/packages/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: url }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/package/${data.name}`);
    } else {
      setError(data.error || "Import failed");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-900">Import from GitHub</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Paste your GitHub repo URL. We will fetch your package.json and publish automatically.
      </p>
      <form onSubmit={handleImport} className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/you/your-mcp-tool"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          Import
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
