# MCPM — MCP Package Manager

The registry and CLI for MCP tools. Like npm, for AI agents.

## Structure

```
mcpm/
├── web/          ← Next.js registry (mcpm.dev)
├── cli/          ← CLI tool (npx mcpm publish)
└── docs/         ← Documentation
```

## Quick Start

```bash
# Install CLI
npm i -g mcpm

# Publish your MCP tool
cd my-mcp-server
mcpm publish

# Install someone else's tool
mcpm add weather-mcp
```

## The Plan

| Phase | What | Time |
|---|---|---|
| **Week 1** | Next.js site + GitHub OAuth + submit page | 7 days |
| **Week 2** | CLI publish + search + deploy | 7 days |
| **Month 2** | Ratings, analytics, semantic search | 30 days |
| **Month 3+** | Enterprise, marketplace, monetize | ongoing |
