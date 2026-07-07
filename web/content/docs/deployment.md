---
title: "Deployment"
description: "Deploy MCP tools to production"
order: 15
---

# Deployment

## Local
```bash
node server.js
```

## PM2
```bash
pm2 start server.js --name tool
```

## Docker
```dockerfile
FROM node:20-alpine
COPY . .
CMD ["node","server.js"]
```