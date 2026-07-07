"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PackageCard } from "@/components/PackageCard";
import { Search, Loader2 } from "lucide-react";

interface SearchResult {
  name: string;
  description: string;
  downloads: number;
  username: string;
  avatar?: string | null;
  createdAt?: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Search header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          {searched && q ? (
            <>
              Results for{" "}
              <span className="text-blue-600">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            "Search MCP tools"
          )}
        </h1>
        <p className="mt-2 text-slate-500">
          {searched && q
            ? `${results.length} package${results.length !== 1 ? "s" : ""} found`
            : "Enter a query to find tools for your agents."}
        </p>
      </div>

      {/* Search bar (pre-filled) */}
      <div className="mb-10">
        <SearchBar />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && results.length === 0 && q && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-700">
            No packages found
          </h2>
          <p className="mt-2 text-slate-500 max-w-md">
            No MCP tools match &ldquo;{q}&rdquo;. Try a different search term or{" "}
            <a href="/publish" className="text-blue-600 hover:underline">
              publish your own
            </a>
            .
          </p>
        </div>
      )}

      {/* Initial state — no query entered */}
      {!searched && !q && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-700">
            Start searching
          </h2>
          <p className="mt-2 text-slate-500 max-w-md">
            Type a tool name or capability above to search the registry.
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((pkg) => (
            <PackageCard
              key={pkg.name}
              name={pkg.name}
              description={pkg.description}
              username={pkg.username}
              avatar={pkg.avatar}
              downloads={pkg.downloads}
              createdAt={pkg.createdAt ? new Date(pkg.createdAt) : new Date()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
