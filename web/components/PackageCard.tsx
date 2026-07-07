import Link from "next/link";
import { formatNumber, timeAgo } from "@/lib/utils";
import { Star, Download, User } from "lucide-react";

interface PackageCardProps {
  name: string;
  description: string | null;
  username: string | null;
  avatar?: string | null;
  downloads: number | null;
  createdAt: Date | null;
}

export function PackageCard({ name, description, username, downloads, createdAt }: PackageCardProps) {
  return (
    <Link
      href={`/package/${name}`}
      className="block rounded-xl border border-slate-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{description ?? ""}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" /> {username ?? "unknown"}
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" /> {formatNumber(downloads ?? 0)}
        </span>
        <span>{createdAt ? timeAgo(new Date(createdAt)) : "—"}</span>
      </div>
    </Link>
  );
}
