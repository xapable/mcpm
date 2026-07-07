"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  name: string;
  description: string;
  downloads: number;
  username: string;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<NodeJS.Timeout>();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounce.current);
    if (value.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`);
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search MCP tools... (e.g., weather, stripe, github)"
            className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.map((r) => (
            <Link
              key={r.name}
              href={`/package/${r.name}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
            >
              <div>
                <p className="font-medium text-slate-900">{r.name}</p>
                <p className="text-sm text-slate-500 truncate max-w-md">{r.description}</p>
              </div>
              <span className="text-xs text-slate-400">{r.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
