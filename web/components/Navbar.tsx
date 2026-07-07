"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Package, Search, User, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="text-slate-900">mcpm</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Discover
          </Link>
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Docs
          </Link>
          <a
            href="https://github.com/xapable/mcpm/discussions"
            target="_blank"
            rel="noopener"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Community
          </a>

          {session ? (
            <>
              <Link
                href="/publish"
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Publish
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
