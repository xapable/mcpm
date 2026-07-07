import { Terminal, ArrowRight, Github, Package, Check } from "lucide-react";
import Link from "next/link";
import { GitHubImport } from "./GitHubImport";

export default function PublishPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Publish a tool</h1>
        <p className="mt-2 text-slate-500">Import from GitHub or publish via CLI.</p>
      </div>

      {/* GitHub Import */}
      <GitHubImport />

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-slate-400">or via CLI</span></div>
      </div>

      <div className="space-y-6">
        {[
          {
            step: "1",
            title: "Install the CLI",
            code: "npm install -g mcpm-dev",
            hint: "",
          },
          {
            step: "2",
            title: "Sign in with GitHub",
            code: "mcpm-dev login",
            hint: "Opens your browser — sign in with GitHub.",
          },
          {
            step: "3",
            title: "Create your project structure",
            code: `my-mcp-server/\n├── package.json      ← name, version, entry point\n├── server.js         ← your MCP server code\n├── mcpm.json         ← client config (recommended)\n└── README.md         ← docs for your users`,
            hint: "These 4 files are all you need. Use mcpm.json to tell clients how to run your server.",
          },
          {
            step: "4",
            title: "Configure mcpm.json (recommended)",
            code: `{\n  "mcp": {\n    "transport": "stdio",\n    "command": "node",\n    "args": ["server.js"],\n    "env": {}\n  }\n}`,
            hint: "mcpm.json becomes the mcpServers config your users paste into their client. Include env vars like API keys here.",
          },
          {
            step: "5",
            title: "Publish",
            code: "cd my-mcp-server\nmcpm-dev publish",
            hint: "",
            done: "Your tool is live at mcpm.dev/package/my-awesome-mcp",
          },
        ].map((item) => (
          <div key={item.step} className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {item.step}
              </span>
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
            </div>
            <pre className="ml-10">{item.code}</pre>
            {item.hint && (
              <p className="ml-10 mt-2 text-sm text-slate-500">{item.hint}</p>
            )}
            {item.done && (
              <div className="ml-10 mt-3 flex items-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                {item.done}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          Need help?{" "}
          <Link href="/docs" className="text-blue-600 hover:underline">Read the docs</Link>
          {" "}or{" "}
          <a href="https://github.com/xapable/mcpm/discussions" target="_blank" className="text-blue-600 hover:underline inline-flex items-center gap-1">
            ask on GitHub <Github className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
