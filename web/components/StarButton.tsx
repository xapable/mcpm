"use client";

import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface StarButtonProps {
  packageName: string;
  initialCount?: number;
}

export function StarButton({ packageName, initialCount = 0 }: StarButtonProps) {
  const { data: session } = useSession();
  const [starred, setStarred] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/packages/${packageName}/star`)
      .then((r) => r.json())
      .then((d) => {
        setStarred(d.starred);
        setCount(d.count);
      });
  }, [packageName]);

  const toggle = async () => {
    if (!session) {
      signIn("github");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/packages/${packageName}/star`, { method: "POST" });
    const data = await res.json();
    setStarred(data.starred);
    setCount((c) => (data.starred ? c + 1 : c - 1));
    setLoading(false);
  };

  const isSignedIn = !!session;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isSignedIn ? (starred ? "Unstar this package" : "Star this package") : "Sign in to star"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
        starred
          ? "border-amber-300 bg-amber-50 text-amber-700"
          : isSignedIn
            ? "border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50"
            : "border-slate-200 bg-slate-50 text-slate-400 hover:border-amber-200 hover:text-amber-500"
      }`}
    >
      <Star className={`h-4 w-4 ${starred ? "fill-amber-500 text-amber-500" : ""}`} />
      {starred ? "Starred" : "Star"} ({count})
    </button>
  );
}
