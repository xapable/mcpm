# MCPM CLI

The command-line tool for publishing and installing MCP tools.

## Commands

```bash
mcpm login          # Authenticate with mcpm.dev
mcpm publish        # Publish current directory as MCP tool
mcpm add <name>     # Install an MCP tool
mcpm search <query> # Search the registry
mcpm whoami         # Show logged-in user
mcpm logout         # Sign out
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
npm i -g mcpm
mcpm login
mcpm publish
```

## Tech Stack

- Node.js + TypeScript
- Commander.js (CLI framework)
- Chalk (colored output)
- Ora (spinners)
