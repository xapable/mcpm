---
title: "Configuration"
description: "Configure tools for different clients"
order: 10
---

# Configuration

There are two sides to MCP configuration:

1. **Client config** — The `mcpServers` JSON your AI app reads to connect to servers
2. **mcpm.json** — The file you include in your project so the registry knows how to run it

## Client Config Files

| Client | Config File |
|--------|-------------|
| Claude Desktop | `claude_desktop_config.json` |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| ChatGPT | Settings → Integrations → MCP |
| VS Code / Copilot | `.vscode/mcp.json` |
| Claude Code | `.mcp.json` |

### Client Config Format

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "sk-..."
      }
    }
  }
}
```

## mcpm.json — The Bridge

When you publish a package to mcpm.dev, include an `mcpm.json` file. Its `mcp` field maps 1:1 to the `mcpServers` entry above:

```json
{
  "mcp": {
    "transport": "stdio",
    "command": "node",
    "args": ["server.js"],
    "env": {}
  }
}
```

When users run `mcpm-dev add <your-tool>`, the CLI reads your `mcpm.json` and generates the exact client config they need. Without it, the CLI falls back to a generic `npx -y <name>` command.
```