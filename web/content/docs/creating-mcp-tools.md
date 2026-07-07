---
title: "Creating MCP Tools"
description: "Build MCP tools from scratch"
order: 5
---

# Creating MCP Tools

## Project Structure

```
my-tool/
  package.json
  server.js
  README.md
```

## Defining Tools

```javascript
const tools = [{
  name: "greet",
  description: "Greet someone",
  parameters: { name: { type: "string" } },
  handler: async ({ name }) => ({ message: `Hello ${name}!` })
}];
```