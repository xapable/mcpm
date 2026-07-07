import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, ilike, or, sql, desc } from "drizzle-orm";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

// Configure marked with syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      // No language = plain text, escape HTML
      return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
  })
);

marked.setOptions({
  gfm: true,
  breaks: true,
});

// Strip hashtags from content body (they're stored in tags column)
function stripHashtags(content: string): string {
  return content
    .split("\n")
    .filter((line) => !/^\s*#\w+\s*$/.test(line.trim()))
    .join("\n");
}

function renderMarkdown(content: string): string {
  const cleaned = stripHashtags(content);
  return marked.parse(cleaned, { async: false }) as string;
}

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

function formatDate(d: Date | null): string {
  return d ? d.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
}

async function getAuthorName(userId: string): Promise<string> {
  const user = await db.select({ username: users.username }).from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.username || "anonymous";
}

async function rowToMeta(row: typeof posts.$inferSelect): Promise<PostMeta> {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    date: formatDate(row.createdAt),
    author: await getAuthorName(row.userId),
    tags: row.tags || [],
    type: row.type as "blog" | "tutorial",
  };
}

async function rowToPost(row: typeof posts.$inferSelect): Promise<Post> {
  return {
    ...(await rowToMeta(row)),
    content: row.content || "",
    html: renderMarkdown(row.content || ""),
  };
}

/** Get all posts of a given type, sorted by date descending */
export async function getAllPosts(type: "blog" | "tutorial"): Promise<PostMeta[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.type, type))
    .orderBy(desc(posts.createdAt));
  return Promise.all(rows.map(rowToMeta));
}

export interface PaginatedResult {
  posts: PostMeta[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Get paginated posts of a given type */
export async function getPaginatedPosts(
  type: "blog" | "tutorial",
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult> {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    db.select().from(posts).where(eq(posts.type, type)).orderBy(desc(posts.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.type, type)),
  ]);

  const total = countResult[0]?.count ?? 0;
  return {
    posts: await Promise.all(rows.map(rowToMeta)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/** Get all posts (blog + tutorials) combined, sorted by date */
export async function getAllContent(): Promise<PostMeta[]> {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return Promise.all(rows.map(rowToMeta));
}

/** Get a single post by slug and type */
export async function getPost(slug: string, type: "blog" | "tutorial"): Promise<Post | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(sql`${posts.slug} = ${slug} AND ${posts.type} = ${type}`)
    .limit(1);
  return rows.length > 0 ? rowToPost(rows[0]) : null;
}

/** Search posts by query (title, description, tags) */
export async function searchPosts(query: string): Promise<PostMeta[]> {
  const q = `%${query}%`;
  const rows = await db
    .select()
    .from(posts)
    .where(
      or(
        ilike(posts.title, q),
        ilike(posts.description, q),
        sql`EXISTS (SELECT 1 FROM unnest(${posts.tags}) t WHERE t ILIKE ${q})`
      )
    )
    .orderBy(desc(posts.createdAt));
  return Promise.all(rows.map(rowToMeta));
}

/** Create a new post in the database */
export async function createPost(
  type: "blog" | "tutorial",
  slug: string,
  userId: string,
  meta: { title: string; description: string; tags?: string[]; content?: string }
): Promise<PostMeta> {
  const [row] = await db
    .insert(posts)
    .values({
      slug,
      type,
      title: meta.title,
      description: meta.description || "",
      content: meta.content || `# ${meta.title}\n\nWrite your content here...`,
      tags: meta.tags || [],
      userId,
    })
    .returning();
  return rowToMeta(row);
}
