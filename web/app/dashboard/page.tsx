"use client";

import { useSession } from "next-auth/react";
import { PackageCard } from "@/components/PackageCard";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Sign in to view your dashboard.</p>
      </div>
    );
  }

  const myPackages = [
    {
      name: "my-weather-mcp",
      description: "Custom weather server with historical data support.",
      username: session.user?.name || "you",
      avatar: session.user?.image,
      downloads: 234,
      createdAt: new Date(),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-500">Manage your published tools.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myPackages.map((pkg) => (
          <PackageCard key={pkg.name} {...pkg} />
        ))}
      </div>

      {myPackages.length === 0 && (
        <p className="mt-8 text-center text-slate-400">
          No packages yet. <a href="/publish" className="text-blue-600 hover:underline">Publish your first tool</a>.
        </p>
      )}
    </div>
  );
}
