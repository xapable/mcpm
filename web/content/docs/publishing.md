---
title: "Publishing"
description: "Publish your MCP tools to the registry"
order: 7
---

# Publishing

## Project Structure

Your MCP server directory needs these files:

```
my-mcp-server/
├── package.json      ← name, version, entry point
├── server.js         ← your MCP server code
├── mcpm.json         ← client config (recommended)
└── README.md         ← docs for your users
```

### package.json

```json
{
  "name": "my-awesome-mcp",
  "version": "1.0.0",
  "description": "Does something amazing",
  "main": "server.js"
}
```

### mcpm.json (recommended)

This file tells MCP clients how to run your server. It maps directly to the `mcpServers` entry users paste into their client config:

```json
{
  "mcp": {
    "transport": "stdio",
    "command": "node",
    "args": ["server.js"],
    "env": {
      "API_KEY": "your-default-here"
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `transport` | Protocol transport — almost always `"stdio"` |
| `command` | The command to run your server (`node`, `python`, `uv`, etc.) |
| `args` | Arguments passed to the command |
| `env` | Environment variables your server needs (API keys, etc.) |

Without `mcpm.json`, the registry falls back to `npx -y <package-name>` as the default client config.

## Publish
```bash
cd my-tool
mcpm-dev publish
```

## Update
```bash
npm version patch
mcpm-dev publish
```

## Delete
Visit your dashboard to manage packages.