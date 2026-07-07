---
title: "Creating MCP Tools"
description: "Build MCP tools from scratch"
order: 5
---

# Creating MCP Tools

## Project Structure

```
my-tool/
├── package.json      ← name, version, entry point
├── server.js         ← MCP server entry point
├── mcpm.json         ← client config (recommended)
└── README.md         ← documentation
```

### mcpm.json — Client Configuration

The `mcpm.json` file maps directly to the `mcpServers` entry that users paste into their AI client config (Claude Desktop, Cursor, Windsurf, etc.):

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

| Field | Purpose |
|-------|---------|
| `transport` | Almost always `"stdio"` for local servers |
| `command` | How to run your server — `node`, `python`, `uv`, etc. |
| `args` | Arguments for the command (e.g., `["server.js"]`) |
| `env` | Environment variables like API keys |

This is the exact structure that appears under `mcpServers.<name>` in `claude_desktop_config.json` and similar client config files. When users install your tool, this config is what they copy-paste.

## Defining Tools

```javascript
const tools = [{
  name: "greet",
  description: "Greet someone",
  parameters: { name: { type: "string" } },
  handler: async ({ name }) => ({ message: `Hello ${name}!` })
}];
```