---
title: "Quick Start"
description: "Get your first MCP tool running in 5 minutes"
order: 2
---

# Quick Start

## 1. Install
```bash
npm install -g mcpm-dev
```

## 2. Login
```bash
mcpm-dev login
```

## 3. Create a Tool

Create `package.json`:
```json
{"name":"hello-mcp","version":"1.0.0","main":"server.js"}
```

Create `mcpm.json` (recommended — becomes the client `mcpServers` config):
```json
{"mcp":{"transport":"stdio","command":"node","args":["server.js"]}}
```

Create `server.js` (your MCP server entry point):
```js
// Your MCP server code here
```

## 4. Publish
```bash
mcpm-dev publish
```