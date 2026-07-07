---
title: "Tool Manifest"
description: "The package.json fields that define your tool"
order: 6
---

# Tool Manifest

## Required Fields

| Field | Description |
|-------|-------------|
| name | Unique package name |
| version | SemVer version |
| main | Entry point |

## MCP Config

```json
{"mcp":{"command":"node","args":["server.js"]}}
```