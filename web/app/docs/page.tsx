import type { Metadata } from "next";
import { getAllDocs } from "@/lib/docs";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs — mcpm",
  description: "Learn how to build, publish, and use MCP tools with mcpm.",
};

export default function DocsPage() {
  const docs = getAllDocs();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Documentation</h1>
      <p className="text-slate-500 mb-8">
        Everything you need to build, publish, and manage MCP tools.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-slate-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-slate-900">{doc.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{doc.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
