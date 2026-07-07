import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  type: "blog" | "tutorial";
}

export interface Post extends PostMeta {
  content: string;
  html: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function getContentDir(type: "blog" | "tutorial"): string {
  return path.join(CONTENT_ROOT, type === "blog" ? "blog" : "tutorials");
}

function parseMarkdownFile(filePath: string, type: "blog" | "tutorial"): Post | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = path.basename(filePath, ".md");

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || new Date().toISOString().split("T")[0],
      author: data.author || "mcpm",
      tags: data.tags || [],
      type,
      content,
      html: marked.parse(content, { async: false }) as string,
    };
  } catch {
    return null;
  }
}

/** Get all posts of a given type, sorted by date descending */
export function getAllPosts(type: "blog" | "tutorial"): PostMeta[] {
  const dir = getContentDir(type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const post = parseMarkdownFile(path.join(dir, f), type);
      if (!post) return null;
      const { html, content, ...meta } = post;
      return meta;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as PostMeta[];
}

/** Get all posts (blog + tutorials) combined, sorted by date */
export function getAllContent(): PostMeta[] {
  return [...getAllPosts("blog"), ...getAllPosts("tutorial")].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Get a single post by slug and type */
export function getPost(slug: string, type: "blog" | "tutorial"): Post | null {
  const filePath = path.join(getContentDir(type), `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseMarkdownFile(filePath, type);
}

/** Search posts by query (title, description, tags) */
export function searchPosts(query: string): PostMeta[] {
  const all = getAllContent();
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

/** Create a new markdown post file */
export function createPost(
  type: "blog" | "tutorial",
  slug: string,
  meta: { title: string; description: string; author?: string; tags?: string[] }
): string {
  const dir = getContentDir(type);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.md`);
  const frontmatter = [
    "---",
    `title: "${meta.title}"`,
    `description: "${meta.description}"`,
    `date: "${new Date().toISOString().split("T")[0]}"`,
    `author: "${meta.author || "mcpm"}"`,
    `tags: [${(meta.tags || []).join(", ")}]`,
    "---",
    "",
    `# ${meta.title}`,
    "",
    "Write your content here...",
  ].join("\n");

  fs.writeFileSync(filePath, frontmatter, "utf-8");
  return filePath;
}
