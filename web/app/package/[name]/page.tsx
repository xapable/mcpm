import { notFound } from "next/navigation";
import { Download, User, Clock } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { getPackageData } from "@/lib/data";
import { StarButton } from "@/components/StarButton";

interface PackagePageProps {
  params: { name: string };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const pkg = await getPackageData(params.name);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pkg.name}</h1>
          <p className="mt-2 text-lg text-slate-500">{pkg.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {pkg.username}
            </span>
            <span>v{pkg.version}</span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" /> {formatNumber(pkg.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {timeAgo(pkg.createdAt)}
            </span>
          </div>
        </div>
        <StarButton packageName={pkg.name} />
      </div>

      {/* Install command */}
      <div className="mt-8 rounded-xl border border-slate-300 bg-slate-900 p-4">
        <p className="mb-2 text-xs text-slate-400">Install</p>
        <code className="text-lg text-green-400">$ npx mcpm-cli add {pkg.name}</code>
      </div>

      {/* README */}
      <div className="mt-10 rounded-xl border border-slate-200 p-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">README</h2>
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700 font-mono">
            {pkg.readme}
          </pre>
        </div>
      </div>
    </div>
  );
}
