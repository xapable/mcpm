"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Package, Search, User, LogOut, Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/search", label: "Discover" },
    { href: "/blog", label: "Blog" },
    { href: "/docs", label: "Docs" },
    { href: "https://github.com/xapable/mcpm/discussions", label: "Community", external: true },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="text-slate-900">mcpm</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            )
          )}

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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              )
            )}

            <div className="my-1 border-t border-slate-100" />

            {session ? (
              <>
                <Link
                  href="/publish"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Publish
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-100 flex items-center gap-1 text-left"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => { signIn("github"); setOpen(false); }}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 text-left"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
