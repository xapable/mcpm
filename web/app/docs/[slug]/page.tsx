import { notFound } from "next/navigation";
import { getDoc } from "@/lib/docs";
import { PostContent } from "@/components/PostContent";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export function generateMetadata({ params }: Props): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return { title: "Not Found" };
  return { title: `${doc.title} — mcpm Docs`, description: doc.description };
}

export default function DocPage({ params }: Props) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();

  return (
    <div className="max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{doc.title}</h1>
      <PostContent html={doc.html} />
    </div>
  );
}
