import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, ilike, or, sql, desc } from "drizzle-orm";
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

function formatDate(d: Date | null): string {
  return d ? d.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
}

function rowToMeta(row: typeof posts.$inferSelect): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    date: formatDate(row.createdAt),
    author: row.author || "mcpm",
    tags: row.tags || [],
    type: row.type as "blog" | "tutorial",
  };
}

function rowToPost(row: typeof posts.$inferSelect): Post {
  return {
    ...rowToMeta(row),
    content: row.content || "",
    html: marked.parse(row.content || "", { async: false }) as string,
  };
}

/** Get all posts of a given type, sorted by date descending */
export async function getAllPosts(type: "blog" | "tutorial"): Promise<PostMeta[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.type, type))
    .orderBy(desc(posts.createdAt));
  return rows.map(rowToMeta);
}

/** Get all posts (blog + tutorials) combined, sorted by date */
export async function getAllContent(): Promise<PostMeta[]> {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return rows.map(rowToMeta);
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
  return rows.map(rowToMeta);
}

/** Create a new post in the database */
export async function createPost(
  type: "blog" | "tutorial",
  slug: string,
  meta: { title: string; description: string; author?: string; tags?: string[]; content?: string }
): Promise<PostMeta> {
  const [row] = await db
    .insert(posts)
    .values({
      slug,
      type,
      title: meta.title,
      description: meta.description || "",
      content: meta.content || `# ${meta.title}\n\nWrite your content here...`,
      author: meta.author || "mcpm",
      tags: meta.tags || [],
    })
    .returning();
  return rowToMeta(row);
}
