"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";

export function PostContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Add copy buttons to all <pre> blocks
    const pres = containerRef.current.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return; // already added
      const wrapper = document.createElement("div");
      wrapper.className = "relative group/code not-prose";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className =
        "copy-btn absolute top-2 right-2 rounded-md bg-slate-700 p-1.5 text-slate-300 opacity-0 group-hover/code:opacity-100 hover:bg-slate-600 transition-all";
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      btn.title = "Copy code";
      btn.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        await navigator.clipboard.writeText(code);
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          btn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        }, 2000);
      };
      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-slate max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-slate-700 prose-p:leading-7 prose-p:my-4
        prose-a:text-blue-600 prose-a:font-medium hover:prose-a:underline
        prose-code:bg-amber-50 prose-code:text-amber-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:shadow-sm
        prose-li:text-slate-700 prose-li:leading-7 prose-li:my-1
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700
        prose-img:rounded-xl prose-img:shadow-md
        prose-hr:border-slate-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
