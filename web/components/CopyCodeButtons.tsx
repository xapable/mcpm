"use client";

import { useEffect } from "react";

/**
 * Adds copy buttons to all <pre> elements on the page.
 * Include once in your root layout — runs automatically.
 */
export function CopyCodeButtons() {
  useEffect(() => {
    function addCopyButtons() {
      document.querySelectorAll("pre").forEach((pre) => {
        // Skip if already wrapped
        if (pre.closest(".code-block-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className =
          "code-block-wrapper relative group/code";

        // Move pre into wrapper
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Copy button
        const btn = document.createElement("button");
        btn.className =
          "copy-btn absolute top-2 right-2 flex items-center gap-1.5 rounded-lg bg-slate-700/80 px-2.5 py-1.5 text-xs text-slate-300 opacity-0 group-hover/code:opacity-100 hover:bg-slate-600 transition-all z-10";
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy</span>`;

        btn.onclick = async () => {
          const code = pre.querySelector("code");
          const text = code?.textContent || pre.textContent || "";
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span class="text-green-400">Copied!</span>`;
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy</span>`;
          }, 2000);
        };
        wrapper.appendChild(btn);
      });
    }

    // Initial run
    addCopyButtons();

    // Watch for DOM changes (e.g., client-side navigation)
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
