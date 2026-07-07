---
title: "Debugging"
description: "Debug MCP tools with logs and traces"
order: 13
---

# Debugging

## Enable Logging
```bash
MCPM_LOG_LEVEL=debug mcpm-dev add tool
```

## Common Issues
- Tool not found: check package.json main field
- Agent ignores tool: restart client
- Permission errors: `chmod +x server.js`