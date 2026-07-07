import { getAllDocs } from "@/lib/docs";
import { DocsNav } from "./DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <DocsNav docs={docs}>{children}</DocsNav>
    </div>
  );
}
