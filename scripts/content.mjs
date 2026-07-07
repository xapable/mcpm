#!/usr/bin/env node
/**
 * mcpm Content CLI — Manage blog posts and tutorials from the terminal.
 *
 * Usage:
 *   node scripts/content.mjs new blog "My Post Title" "Short description" --tags mcp,guide
 *   node scripts/content.mjs new tutorial "How to X" "Learn to do X" --tags beginner
 *   node scripts/content.mjs list                    # list all blog + tutorial posts
 *   node scripts/content.mjs list blog               # list only blog posts
 *   node scripts/content.mjs list tutorials          # list only tutorials
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, "..", "web", "content");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getContentDir(type) {
  return path.join(CONTENT_DIR, type === "blog" ? "blog" : "tutorials");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const tagsIndex = args.indexOf("--tags");
  const tags = tagsIndex !== -1 ? args[tagsIndex + 1]?.split(",").map((t) => t.trim()).filter(Boolean) || [] : [];
  const cleanArgs = tagsIndex !== -1 ? args.slice(0, tagsIndex) : args;

  return { command, args: cleanArgs, tags };
}

function cmdNew(type, title, description, tags) {
  if (!title) {
    console.error("Error: Title is required. Usage: content.mjs new <blog|tutorial> \"Title\" \"Description\" --tags tag1,tag2");
    process.exit(1);
  }

  const slug = slugify(title);
  const dir = getContentDir(type);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.error(`Error: Post already exists: ${filePath}`);
    process.exit(1);
  }

  const frontmatter = [
    "---",
    `title: "${title}"`,
    `description: "${description || ""}"`,
    `date: "${new Date().toISOString().split("T")[0]}"`,
    `author: "mcpm"`,
    `tags: [${tags.join(", ")}]`,
    "---",
    "",
    `# ${title}`,
    "",
    "Write your content here...",
  ].join("\n");

  fs.writeFileSync(filePath, frontmatter, "utf-8");

  console.log(`✅ Created ${type}: ${filePath}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Open in VS Code: code ${filePath}`);
}

function cmdList(filterType) {
  const types = filterType ? [filterType] : ["blog", "tutorials"];

  for (const type of types) {
    const dir = getContentDir(type);
    if (!fs.existsSync(dir)) {
      console.log(`\n📁 ${type}/ (empty)`);
      continue;
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    console.log(`\n📁 ${type}/ (${files.length} posts)`);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const match = raw.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        const frontmatter = match[1];
        const titleMatch = frontmatter.match(/title:\s*"(.+)"/);
        const dateMatch = frontmatter.match(/date:\s*"(.+)"/);
        console.log(`   ${dateMatch?.[1] || "????"}  ${titleMatch?.[1] || file}  (${file})`);
      } else {
        console.log(`   ????  ${file}`);
      }
    }
  }
}

// --- Main ---
const { command, args, tags } = parseArgs();

switch (command) {
  case "new": {
    const type = args[1];
    if (type !== "blog" && type !== "tutorial") {
      console.error("Error: Type must be 'blog' or 'tutorial'");
      process.exit(1);
    }
    cmdNew(type, args[2], args[3], tags);
    break;
  }
  case "list": {
    const filterType = args[1];
    if (filterType && filterType !== "blog" && filterType !== "tutorials") {
      console.error("Error: Filter must be 'blog' or 'tutorials'");
      process.exit(1);
    }
    cmdList(filterType);
    break;
  }
  default:
    console.log(`
mcpm Content CLI — Manage blog & tutorial posts.

Usage:
  node scripts/content.mjs new blog "My Post Title" "Short description" --tags mcp,guide
  node scripts/content.mjs new tutorial "How to X" "Learn to do X" --tags beginner
  node scripts/content.mjs list               # list all posts
  node scripts/content.mjs list blog          # list blog posts
  node scripts/content.mjs list tutorials     # list tutorials
`);
    break;
}
