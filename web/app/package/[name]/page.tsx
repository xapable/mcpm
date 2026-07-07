import { notFound } from "next/navigation";
import { Download, User, Clock, Github, ExternalLink } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";
import { getPackageData } from "@/lib/data";
import { StarButton } from "@/components/StarButton";
import { QuickInstall } from "@/components/QuickInstall";

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
            <StarButton packageName={pkg.name} />
          </div>
        </div>
        {pkg.repoUrl && (
          <a
            href={pkg.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        )}
      </div>

      {/* CLI install */}
      <QuickInstall name={pkg.name} />

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
