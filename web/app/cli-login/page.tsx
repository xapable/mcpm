"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CliLoginPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    const res = await fetch("/api/cli-token", { method: "POST" });
    const data = await res.json();
    setToken(data.token);
    setLoading(false);
  };

  const copyCommand = async () => {
    if (!token || !session?.user?.name) return;
    await navigator.clipboard.writeText(
      `mcpm-dev auth --token ${token} --username ${session.user.name}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Sign in first to get your CLI token.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">CLI Authentication</h1>
      <p className="mt-2 text-slate-500">
        Generate a token to authenticate the mcpm CLI.
      </p>

      {!token ? (
        <button
          onClick={generateToken}
          disabled={loading}
          className="mt-6 rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Token"}
        </button>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs text-slate-400 mb-2">Run this in your terminal:</p>
            <code className="text-sm text-slate-700 break-all">
              mcpm auth --token {token} --username {session.user?.name}
            </code>
          </div>
          <button
            onClick={copyCommand}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy command"}
          </button>
        </div>
      )}
    </div>
  );
}
