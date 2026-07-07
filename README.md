# mcpm.dev — The MCP Registry

The central registry for MCP tools. Like npm, for AI agents.

**Discover, publish, and share MCP servers.** Search at [mcpm.dev/search](https://www.mcpm.dev/search), publish with one CLI command, install anywhere.

## Why mcpm.dev

MCP tools are scattered across GitHub repos. There's no central place to discover them. mcpm.dev is that place.

- 🔍 **Discover** — browse all tools at [mcpm.dev/search](https://www.mcpm.dev/search)
- 📦 **Publish** — `mcpm-dev publish` from your project directory
- 🐙 **Import** — paste a GitHub repo URL on [mcpm.dev/publish](https://www.mcpm.dev/publish)
- 👥 **GitHub OAuth** — no new account needed
- 🔗 **CLI-first** — `mcpm-dev add <name>` copies straight to your clipboard

## Quick Start

```bash
# Install CLI
npm install -g mcpm-dev

# Sign in
mcpm-dev login

# Find tools
mcpm-dev search weather

# Install a tool
mcpm-dev add timer-mcp
```

## Project Structure (for publishers)

```
my-mcp-server/
├── package.json      ← name, version, entry point
├── server.js         ← your MCP server code
├── mcpm.json         ← client config (recommended)
└── README.md         ← docs for your users
```

### mcpm.json

Tells MCP clients how to run your server. Maps 1:1 to the `mcpServers` entry in client config files:

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

Without `mcpm.json`, the registry falls back to `npx -y <package-name>`.

## CLI Commands

```bash
mcpm-dev login          # Authenticate with mcpm.dev
mcpm-dev publish        # Publish current directory as MCP tool
mcpm-dev add <name>     # Install an MCP tool
mcpm-dev search <query> # Search the registry
mcpm-dev info <name>    # Show package details and README
mcpm-dev whoami         # Show logged-in user
mcpm-dev logout         # Sign out
mcpm-dev token          # Print auth token
```

## Repo Structure

```
mcpm/
├── web/               ← Next.js registry (mcpm.dev)
├── cli/               ← CLI tool (mcpm-dev)
├── templates/          ← Starter MCP server template
│   ├── mcpm.json       ← Template for client config
│   └── starter-mcp/    ← Minimal MCP server example
└── docs/               ← (deprecated, docs live in web/content/docs/)
```
