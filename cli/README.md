# MCPM CLI

The command-line tool for publishing and installing MCP tools.

## Commands

```bash
mcpm-dev login          # Authenticate with mcpm.dev
mcpm-dev publish        # Publish current directory as MCP tool
mcpm-dev add <name>     # Install an MCP tool
mcpm-dev search <query> # Search the registry
mcpm-dev whoami         # Show logged-in user
mcpm-dev logout         # Sign out
```

## Publishing

Your project needs:
```
my-mcp-server/
├── package.json     ← name, version, description
├── index.js         ← MCP server entry point (or index.ts)
└── README.md        ← documentation
```

Then:
```bash
npm i -g mcpm-dev
mcpm-dev login
mcpm-dev publish
```

## Tech Stack

- Node.js + TypeScript
- Commander.js (CLI framework)
- Chalk (colored output)
- Ora (spinners)
