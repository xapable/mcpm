# MCPM CLI

The command-line tool for publishing and installing MCP tools.

## Commands

```bash
mcpm-cli login          # Authenticate with mcpm.dev
mcpm-cli publish        # Publish current directory as MCP tool
mcpm-cli add <name>     # Install an MCP tool
mcpm-cli search <query> # Search the registry
mcpm-cli whoami         # Show logged-in user
mcpm-cli logout         # Sign out
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
npm i -g mcpm-cli
mcpm-cli login
mcpm-cli publish
```

## Tech Stack

- Node.js + TypeScript
- Commander.js (CLI framework)
- Chalk (colored output)
- Ora (spinners)
