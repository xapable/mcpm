"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Package, Github } from "lucide-react";

export default function PublishPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Sign in to publish tools.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        version: "1.0.0",
        repoUrl: form.get("repoUrl"),
        readme: `# ${form.get("name")}\n\n${form.get("description") || "An MCP tool."}`,
      }),
    });

    if (res.ok) {
      router.push(`/package/${form.get("name")}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to publish");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Publish a tool</h1>
        <p className="mt-2 text-slate-500">
          Share your MCP server. One command, live on mcpm.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Package name</label>
          <input
            name="name"
            required
            placeholder="my-awesome-mcp"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <input
            name="description"
            placeholder="What does your tool do?"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <span className="inline-flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" /> Repository URL
            </span>
          </label>
          <input
            name="repoUrl"
            placeholder="https://github.com/you/repo"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
