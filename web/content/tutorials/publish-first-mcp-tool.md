---
title: "How to Publish Your First MCP Tool"
description: "A step-by-step guide to creating and publishing your first MCP tool on mcpm."
date: "2026-07-07"
author: "mcpm"
tags: ["tutorial", "publishing", "beginner"]
---

# How to Publish Your First MCP Tool

This guide walks you through creating and publishing your first MCP tool on mcpm.

## Prerequisites

- Node.js 18+
- An MCP tool ready to publish
- A GitHub account (for authentication)

## Step 1: Install the CLI

```bash
npm install -g mcpm
```

## Step 2: Log In

```bash
mcpm login
```

This will open your browser for GitHub authentication.

## Step 3: Prepare Your Tool

Your MCP tool should have:

- A `package.json` with name, description, and version
- An executable entry point
- A README.md explaining how to use it

## Step 4: Publish

```bash
mcpm publish
```

That's it! Your tool is now available on mcpm.dev for anyone to discover and install.

## Step 5: Verify

Visit `https://www.mcpm.dev/package/your-tool-name` to see your published package.

## Next Steps

- Add a comprehensive README
- Tag your tool with relevant keywords
- Share it with the community

Happy building! 🚀
