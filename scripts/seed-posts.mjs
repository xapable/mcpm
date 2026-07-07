const { neon } = require("@neondatabase/serverless");
const url = "postgresql://neondb_owner:npg_gXS1wEzeN7jZ@ep-bitter-sunset-at25w028.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(url);

const blogContent = `# Welcome to mcpm — The MCP Package Manager

We're excited to launch **mcpm** — the open-source package manager for MCP (Model Context Protocol) tools.

## What is mcpm?

mcpm lets you:

- **Discover** MCP tools built by the community
- **Publish** your own MCP tools with a single command
- **Install** tools directly into your AI agents

## Getting Started

\`\`\`bash
npm install -g mcpm
mcpm search weather
mcpm add stripe-mcp
\`\`\`

## Why MCP Matters

The Model Context Protocol lets AI agents interact with external tools and APIs. mcpm makes it easy to share and discover these tools — think npm, but for AI agent capabilities.`;

const tutorialContent = `# How to Publish Your First MCP Tool

This guide walks you through creating and publishing your first MCP tool on mcpm.

## Prerequisites

- Node.js 18+
- An MCP tool ready to publish
- A GitHub account

## Step 1: Install the CLI

\`\`\`bash
npm install -g mcpm
\`\`\`

## Step 2: Log In

\`\`\`bash
mcpm login
\`\`\`

## Step 3: Prepare Your Tool

Your MCP tool should have a package.json with name, description, and version.

## Step 4: Publish

\`\`\`bash
mcpm publish
\`\`\`

That's it! Your tool is now available on mcpm.dev.

## Step 5: Verify

Visit https://www.mcpm.dev/package/your-tool-name to see your published package.`;

async function seed() {
  await sql`
    INSERT INTO post (slug, type, title, description, content, author, tags) 
    VALUES ('welcome-to-mcpm', 'blog', 'Welcome to mcpm — The MCP Package Manager', 
    'Introducing mcpm: the open-source registry for MCP tools.', 
    ${blogContent}, 'mcpm', ARRAY['mcp','announcement','open-source'])
    ON CONFLICT (slug) DO NOTHING
  `;

  await sql`
    INSERT INTO post (slug, type, title, description, content, author, tags)
    VALUES ('publish-first-mcp-tool', 'tutorial', 'How to Publish Your First MCP Tool',
    'A step-by-step guide to creating and publishing your first MCP tool on mcpm.',
    ${tutorialContent}, 'mcpm', ARRAY['tutorial','publishing','beginner'])
    ON CONFLICT (slug) DO NOTHING
  `;

  console.log("✅ Seeded 2 posts");
}

seed().catch((e) => console.error(e));
