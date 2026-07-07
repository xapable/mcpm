#!/usr/bin/env node
// Seed mcpm.dev with demo packages
// Usage: node seed.mjs

const TOOLS = [
  { name: "stripe-mcp", desc: "Process payments, manage subscriptions, and create invoices via Stripe API.", version: "2.1.0", readme: "# Stripe MCP\n\nFull Stripe API access for AI agents.\n\n## Features\n- Create payment intents\n- Manage subscriptions\n- Generate invoices\n- Handle webhooks" },
  { name: "slack-mcp", desc: "Send messages, manage channels, and interact with Slack workspaces.", version: "1.8.0", readme: "# Slack MCP\n\nSlack integration for AI agents.\n\n## Features\n- Send messages to channels\n- Create and manage channels\n- Search messages\n- Set user status" },
  { name: "github-mcp", desc: "Full GitHub API: repos, issues, PRs, code search, and actions.", version: "3.2.0", readme: "# GitHub MCP\n\nGitHub API for AI agents.\n\n## Features\n- Create and manage repos\n- Open issues and PRs\n- Search code\n- Trigger workflows" },
  { name: "notion-mcp", desc: "Read and write Notion pages, databases, and comments.", version: "1.5.0", readme: "# Notion MCP\n\nNotion workspace access for AI agents.\n\n## Features\n- Query databases\n- Create and update pages\n- Manage blocks\n- Add comments" },
  { name: "weather-mcp", desc: "Get real-time weather forecasts and historical data for any location worldwide.", version: "2.0.0", readme: "# Weather MCP\n\nWeather data for AI agents.\n\n## Features\n- Current conditions\n- 7-day forecast\n- Historical weather\n- Severe weather alerts" },
  { name: "spotify-mcp", desc: "Control Spotify playback, manage playlists, and search music.", version: "1.3.0", readme: "# Spotify MCP\n\nSpotify music control for AI agents.\n\n## Features\n- Play and pause music\n- Search tracks, albums, artists\n- Manage playlists\n- Get recommendations" },
  { name: "gmail-mcp", desc: "Read, send, and manage Gmail emails and attachments.", version: "2.4.0", readme: "# Gmail MCP\n\nGmail access for AI agents.\n\n## Features\n- Read inbox\n- Send emails\n- Search messages\n- Manage labels" },
  { name: "google-drive-mcp", desc: "Upload, download, search, and manage Google Drive files.", version: "1.9.0", readme: "# Google Drive MCP\n\nDrive file management for AI agents.\n\n## Features\n- Upload and download files\n- Search documents\n- Manage folders\n- Share files" },
  { name: "twitter-mcp", desc: "Post tweets, search timeline, and manage Twitter/X accounts.", version: "2.2.0", readme: "# Twitter MCP\n\nTwitter/X API for AI agents.\n\n## Features\n- Post tweets\n- Search timeline\n- Follow/unfollow users\n- Get trending topics" },
  { name: "discord-mcp", desc: "Send messages, manage servers, and interact with Discord communities.", version: "1.7.0", readme: "# Discord MCP\n\nDiscord bot integration for AI agents.\n\n## Features\n- Send messages to channels\n- Manage server roles\n- Create slash commands\n- Handle interactions" },
  { name: "airtable-mcp", desc: "Query, create, and update Airtable bases, tables, and records.", version: "1.4.0", readme: "# Airtable MCP\n\nAirtable database access for AI agents.\n\n## Features\n- Query records\n- Create and update rows\n- Manage bases and tables\n- Filter and sort data" },
  { name: "figma-mcp", desc: "Read Figma designs, export assets, and manage design files.", version: "1.1.0", readme: "# Figma MCP\n\nFigma design access for AI agents.\n\n## Features\n- Read design files\n- Export assets\n- Get component info\n- Access styles and variables" },
  { name: "linear-mcp", desc: "Manage Linear issues, projects, and teams for engineering workflows.", version: "1.6.0", readme: "# Linear MCP\n\nLinear project management for AI agents.\n\n## Features\n- Create and update issues\n- Manage projects\n- Assign team members\n- Query workflows" },
  { name: "supabase-mcp", desc: "Query Supabase databases, manage auth, and access storage.", version: "2.0.0", readme: "# Supabase MCP\n\nSupabase backend access for AI agents.\n\n## Features\n- SQL queries\n- Auth management\n- File storage\n- Real-time subscriptions" },
  { name: "openai-mcp", desc: "Access OpenAI models: GPT-4, DALL-E, Whisper, and embeddings.", version: "3.0.0", readme: "# OpenAI MCP\n\nOpenAI API for AI agents.\n\n## Features\n- Chat completions\n- Image generation\n- Speech-to-text\n- Embeddings" },
  { name: "anthropic-mcp", desc: "Access Claude models for text generation and analysis.", version: "2.5.0", readme: "# Anthropic MCP\n\nClaude API for AI agents.\n\n## Features\n- Text generation\n- Document analysis\n- Code review\n- Multi-turn conversations" },
  { name: "pinecone-mcp", desc: "Vector database operations: upsert, query, and manage indexes.", version: "1.8.0", readme: "# Pinecone MCP\n\nVector database for AI agents.\n\n## Features\n- Upsert vectors\n- Semantic search\n- Index management\n- Namespace operations" },
  { name: "sentry-mcp", desc: "Monitor errors, view crash reports, and manage Sentry projects.", version: "1.3.0", readme: "# Sentry MCP\n\nError monitoring for AI agents.\n\n## Features\n- View error reports\n- Manage projects\n- Resolve issues\n- Get performance data" },
  { name: "vercel-mcp", desc: "Deploy projects, manage domains, and view Vercel analytics.", version: "1.5.0", readme: "# Vercel MCP\n\nVercel platform access for AI agents.\n\n## Features\n- Deploy projects\n- Manage domains\n- View analytics\n- Configure environment" },
  { name: "resend-mcp", desc: "Send transactional emails with Resend API.", version: "1.0.0", readme: "# Resend MCP\n\nEmail delivery for AI agents.\n\n## Features\n- Send emails\n- Manage templates\n- Track delivery\n- Handle bounces" },
  { name: "plaid-mcp", desc: "Connect bank accounts, fetch transactions, and verify identities via Plaid.", version: "2.1.0", readme: "# Plaid MCP\n\nFinancial data access for AI agents.\n\n## Features\n- Link bank accounts\n- Fetch transactions\n- Verify identity\n- Check balances" },
  { name: "twilio-mcp", desc: "Send SMS, make calls, and manage Twilio communications.", version: "1.9.0", readme: "# Twilio MCP\n\nCommunication APIs for AI agents.\n\n## Features\n- Send SMS\n- Make phone calls\n- Send WhatsApp messages\n- Manage phone numbers" },
  { name: "calendly-mcp", desc: "Schedule meetings, check availability, and manage Calendly events.", version: "1.2.0", readme: "# Calendly MCP\n\nScheduling for AI agents.\n\n## Features\n- Get availability\n- Create events\n- Cancel/reschedule\n- List scheduled meetings" },
  { name: "hubspot-mcp", desc: "Manage CRM contacts, deals, and marketing via HubSpot API.", version: "1.7.0", readme: "# HubSpot MCP\n\nCRM access for AI agents.\n\n## Features\n- Manage contacts\n- Track deals\n- Create marketing emails\n- View analytics" },
  { name: "zapier-mcp", desc: "Trigger Zaps, manage workflows, and connect 5000+ apps via Zapier.", version: "1.4.0", readme: "# Zapier MCP\n\nWorkflow automation for AI agents.\n\n## Features\n- Trigger Zaps\n- Manage workflows\n- Connect apps\n- Monitor runs" },
  { name: "jira-mcp", desc: "Create and manage Jira issues, sprints, and projects.", version: "2.3.0", readme: "# Jira MCP\n\nJira project management for AI agents.\n\n## Features\n- Create issues\n- Manage sprints\n- Query boards\n- Track time" },
  { name: "confluence-mcp", desc: "Read, create, and search Confluence pages and spaces.", version: "1.6.0", readme: "# Confluence MCP\n\nConfluence wiki access for AI agents.\n\n## Features\n- Search pages\n- Create documents\n- Manage spaces\n- View page history" },
  { name: "shopify-mcp", desc: "Manage Shopify products, orders, and customers.", version: "2.0.0", readme: "# Shopify MCP\n\nE-commerce access for AI agents.\n\n## Features\n- Manage products\n- Process orders\n- Track inventory\n- View analytics" },
  { name: "woocommerce-mcp", desc: "Manage WooCommerce products, orders, and coupons.", version: "1.5.0", readme: "# WooCommerce MCP\n\nWordPress e-commerce for AI agents.\n\n## Features\n- Manage products\n- Process orders\n- Create coupons\n- View reports" },
  { name: "aws-mcp", desc: "Manage AWS services: S3, Lambda, EC2, and more.", version: "3.1.0", readme: "# AWS MCP\n\nAmazon Web Services access for AI agents.\n\n## Features\n- S3 bucket operations\n- Lambda function management\n- EC2 instance control\n- CloudWatch monitoring" },
];

const REGISTRY = "https://www.mcpm.dev";
const AUTH = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyZjY0NmIwYy00MmZlLTQzYTItOTU0NS0yODgyYjIwZThjNDIiLCJ1c2VybmFtZSI6InhhcGFibGUiLCJleHAiOjE3ODYwMDc3ODh9.aZL3OwHw1IApFffj4C-5r517EOVnZzUOi2pq1BX5pAY";

async function publish(tool) {
  const res = await fetch(`${REGISTRY}/api/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTH,
    },
    body: JSON.stringify({
      name: tool.name,
      description: tool.desc,
      version: tool.version,
      repoUrl: "",
      readme: tool.readme,
    }),
  });
  const data = await res.json();
  if (data.ok || data.name) {
    console.log(`✅ ${tool.name}`);
  } else {
    console.log(`❌ ${tool.name}: ${data.error}`);
  }
}

console.log(`Seeding ${TOOLS.length} MCP tools to mcpm.dev...\n`);

for (const tool of TOOLS) {
  await publish(tool);
}

console.log(`\nDone! View at ${REGISTRY}`);
