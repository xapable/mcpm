# mcpm.dev — The MCP Registry

The central registry for MCP tools. Like npm, for AI agents.

**Discover, publish, and share MCP servers.** Works with any MCP client (Claude Desktop, Cursor, Windsurf, mcpm.sh, etc.).

## Why mcpm.dev

MCP tools are scattered across GitHub repos. There's no central place to discover them. mcpm.dev is that place.

- 🔍 **Search** by capability, not just name
- 📦 **Publish** in one command
- 👥 **GitHub OAuth** — no new account needed
- 🔗 **Works with everything** — mcpm.sh, Claude, Cursor, any MCP client

## Quick Start

```bash
# Publish your MCP tool
npx mcpm-dev publish

# Find tools for your agent
npx mcpm-dev search weather
```

## How it fits

```
mcpm.dev (registry)  ←  You publish here
       ↓
  Any MCP client  →  mcpm.sh, Claude Desktop, Cursor, Windsurf
```

We're the registry layer. Other tools (like [mcpm.sh](https://mcpm.sh)) handle local server management. Together, the ecosystem works.

## Structure

```
mcpm/
├── web/          ← Next.js registry (mcpm.dev)
├── cli/          ← CLI tool (mcpm-dev)
└── docs/         ← Documentation
```

## Quick Start

```bash
# Install CLI
npm i -g mcpm-dev

# Publish your MCP tool
cd my-mcp-server
mcpm-dev publish

# Install someone else's tool
mcpm-dev add weather-mcp
```

## The Plan

| Phase | What | Time |
|---|---|---|
| **Week 1** | Next.js site + GitHub OAuth + submit page | 7 days |
| **Week 2** | CLI publish + search + deploy | 7 days |
| **Month 2** | Ratings, analytics, semantic search | 30 days |
| **Month 3+** | Enterprise, marketplace, monetize | ongoing |
