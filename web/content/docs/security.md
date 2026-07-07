---
title: "Security"
description: "Best practices for securing MCP tools"
order: 11
---

# Security

## API Keys
Use environment variables, never hardcode:

```json
{"mcp":{"env":{"API_KEY":"${API_KEY}"}}}
```

## Input Validation
Always validate:
```javascript
if (typeof input !== "string") return { error: "Invalid" };
```