"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Package, Users, Star, TrendingUp } from "lucide-react";

interface AdminData {
  stats: { totalPackages: number; totalUsers: number; totalStars: number };
  topPackages: { name: string; downloads: number; username: string; versionCount: number; starCount: number }[];
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    fetch("/api/packages/admin")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Sign in to view admin.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Admin</h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        {[
          { icon: Package, label: "Packages", value: data.stats.totalPackages },
          { icon: Users, label: "Users", value: data.stats.totalUsers },
          { icon: Star, label: "Stars", value: data.stats.totalStars },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 p-6">
            <s.icon className="h-6 w-6 text-blue-600" />
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top packages */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Top Packages</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 font-medium text-slate-600">Publisher</th>
                <th className="px-4 py-3 font-medium text-slate-600">Downloads</th>
                <th className="px-4 py-3 font-medium text-slate-600">Versions</th>
                <th className="px-4 py-3 font-medium text-slate-600">Stars</th>
              </tr>
            </thead>
            <tbody>
              {data.topPackages.map((p) => (
                <tr key={p.name} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.username}</td>
                  <td className="px-4 py-3 text-slate-700">{p.downloads.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500">{p.versionCount}</td>
                  <td className="px-4 py-3 text-slate-500">{p.starCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
