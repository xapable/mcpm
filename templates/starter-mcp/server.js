#!/usr/bin/env node
/**
 * Starter MCP Server Template
 * 
 * This is a minimal MCP server you can extend with your own tools.
 * 
 * Usage:
 *   1. npm install @modelcontextprotocol/sdk
 *   2. Edit the tools below
 *   3. mcpm-dev publish
 *   4. Add to your MCP client config
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ═══════════════════════════════════════════
// Define your tools here
// ═══════════════════════════════════════════

const TOOLS = [
  {
    name: "hello",
    description: "Say hello to someone",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Who to greet",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_time",
    description: "Get the current time in any timezone",
    inputSchema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Timezone (e.g. 'America/New_York', 'Asia/Tokyo'). Defaults to UTC.",
        },
      },
    },
  },
  // Add more tools here...
];

// ═══════════════════════════════════════════
// Tool implementation
// ═══════════════════════════════════════════

async function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "hello": {
      const person = (args.name as string) || "World";
      return {
        content: [{ type: "text", text: `Hello, ${person}! 👋` }],
      };
    }

    case "get_time": {
      const tz = (args.timezone as string) || "UTC";
      try {
        const time = new Date().toLocaleTimeString("en-US", { timeZone: tz });
        return {
          content: [{ type: "text", text: `Current time in ${tz}: ${time}` }],
        };
      } catch {
        return {
          content: [{ type: "text", text: `Invalid timezone: ${tz}` }],
          isError: true,
        };
      }
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
}

// ═══════════════════════════════════════════
// Server setup — don't modify below
// ═══════════════════════════════════════════

const server = new Server(
  {
    name: process.env.MCP_SERVER_NAME || "starter-mcp",
    version: process.env.MCP_SERVER_VERSION || "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return handleToolCall(request.params.name, request.params.arguments || {});
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch(console.error);
