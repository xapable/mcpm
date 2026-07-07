import { Terminal, ArrowRight, Github, Package, Check } from "lucide-react";
import Link from "next/link";

export default function PublishPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Publish via CLI</h1>
        <p className="mt-2 text-slate-500">One command. Your tool is live on mcpm.</p>
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
            title: "Prepare your package.json",
            code: `{\n  "name": "my-awesome-mcp",\n  "version": "1.0.0",\n  "description": "Does something amazing",\n  "main": "server.js"\n}`,
            hint: "Your MCP tool needs a package.json in its directory.",
          },
          {
            step: "4",
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
            <div className="ml-10 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
              {item.code}
            </div>
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
          <Link href="/tutorials" className="text-blue-600 hover:underline">Read tutorials</Link>
          {" "}or{" "}
          <a href="https://github.com/xapable/mcpm/discussions" target="_blank" className="text-blue-600 hover:underline inline-flex items-center gap-1">
            ask on GitHub <Github className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
