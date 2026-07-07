"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";

interface Props {
  name: string;
  description: string;
  downloads: number;
  createdAt: Date;
  username: string;
}

export function DashboardPackageCard(props: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${props.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/packages/${props.name}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <Link href={`/package/${props.name}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
            {props.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{props.description || "No description"}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span>{props.downloads} downloads</span>
            <Link href={`/package/${props.name}`} className="text-blue-600 hover:underline inline-flex items-center gap-1">
              View <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-3 shrink-0 rounded-lg p-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
          title="Delete package"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
