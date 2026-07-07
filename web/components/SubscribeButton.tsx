"use client";

import { Bell, BellRing, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface SubscribeButtonProps {
  packageName: string;
}

export function SubscribeButton({ packageName }: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check subscription status
    const stored = localStorage.getItem(`sub:${packageName}`);
    if (stored === "true") setSubscribed(true);
  }, [packageName]);

  const toggle = async () => {
    setLoading(true);
    const next = !subscribed;
    localStorage.setItem(`sub:${packageName}`, String(next));

    if (next) {
      await fetch(`/api/packages/${packageName}/subscribe`, { method: "POST" });
    } else {
      await fetch(`/api/packages/${packageName}/subscribe`, { method: "DELETE" });
    }

    setSubscribed(next);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
        subscribed
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-slate-300 bg-white text-slate-600 hover:border-blue-300"
      }`}
    >
      {subscribed ? (
        <BellRing className="h-4 w-4 text-blue-500" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
      {subscribed ? "Watching" : "Watch"} for updates
    </button>
  );
}
