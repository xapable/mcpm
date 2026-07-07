"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function PostContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  // Load highlight.js CSS
  useEffect(() => {
    if (document.querySelector("#hljs-theme")) return;
    const link = document.createElement("link");
    link.id = "hljs-theme";
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    document.head.appendChild(link);
  }, []);

  // Generate ToC from headings
  const tocItems = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const items: TocItem[] = [];
    headings.forEach((h, i) => {
      items.push({ id: `heading-${i}`, text: h.textContent || "", level: parseInt(h.tagName[1]) });
    });
    return items;
  }, [html]);

  useEffect(() => { setToc(tocItems); }, [tocItems]);

  // Add IDs to headings and copy buttons to code blocks
  useEffect(() => {
    if (!containerRef.current) return;

    // Add IDs to headings for ToC linking
    const headings = containerRef.current.querySelectorAll("h2, h3");
    headings.forEach((h, i) => { h.id = `heading-${i}`; });

    // Add copy buttons to pre blocks
    const pres = containerRef.current.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.closest(".code-block-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper relative group/code mt-3 rounded-lg border border-slate-200 bg-slate-900 overflow-hidden";

      // Language label
      const code = pre.querySelector("code");
      const langClass = code?.className.match(/language-(\w+)/)?.[1] || code?.className.match(/lang-(\w+)/)?.[1];
      if (langClass) {
        const label = document.createElement("span");
        label.className = "absolute top-3 left-4 text-xs font-mono text-slate-500 uppercase tracking-wider";
        label.textContent = langClass;
        wrapper.appendChild(label);
      }

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Copy button
      const btn = document.createElement("button");
      btn.className = "copy-btn absolute top-2 right-2 flex items-center gap-1.5 rounded-lg bg-slate-700/80 px-2.5 py-1.5 text-xs text-slate-300 opacity-0 group-hover/code:opacity-100 hover:bg-slate-600 transition-all";
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy</span>`;

      btn.onclick = async () => {
        const codeText = code?.textContent || pre.textContent || "";
        await navigator.clipboard.writeText(codeText);
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span class="text-green-400">Copied!</span>`;
        setTimeout(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy</span>`;
        }, 2000);
      };
      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <div className="flex gap-10">
      {/* Table of Contents — only show for posts with >3 headings */}
      {toc.length > 3 && (
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">On this page</h4>
            <nav className="space-y-0.5 border-l-2 border-slate-200">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm py-1 text-slate-500 hover:text-slate-900 transition-colors border-l-2 -ml-0.5 ${
                    item.level === 3 ? "pl-5 border-transparent hover:border-slate-300" : "pl-3 border-transparent hover:border-slate-400"
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Content */}
      <div
        ref={containerRef}
        className="min-w-0 flex-1 prose prose-slate max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:scroll-mt-24
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-slate-700 prose-p:leading-7 prose-p:my-4
          prose-a:text-blue-600 prose-a:font-medium hover:prose-a:underline
          prose-code:bg-amber-50 prose-code:text-amber-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:!bg-transparent prose-pre:!border-0 prose-pre:!p-0 prose-pre:!m-0 prose-pre:!rounded-none
          prose-li:text-slate-700 prose-li:leading-7 prose-li:my-1
          prose-strong:text-slate-900 prose-strong:font-semibold
          prose-blockquote:border-l-blue-400 prose-blockquote:bg-slate-50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-600 prose-blockquote:text-base
          prose-img:rounded-xl prose-img:shadow-md
          prose-hr:border-slate-200
          [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:text-sm [&_pre_code]:leading-relaxed [&_pre_code]:text-[#e6edf3]
          [&_pre_code:not([class*='hljs'])]:!text-[#e6edf3] [&_pre_code:not([class*='hljs'])]:!bg-transparent
          [&_.hljs-keyword]:!text-[#ff7b72] [&_.hljs-string]:!text-[#a5d6ff] [&_.hljs-comment]:!text-[#8b949e] [&_.hljs-function]:!text-[#d2a8ff]
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
