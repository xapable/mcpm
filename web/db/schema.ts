import { pgTable, text, integer, timestamp, serial, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  githubId: integer("github_id").unique().notNull(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").default(""),
  userId: text("user_id").references(() => users.id).notNull(),
  repoUrl: text("repo_url").default(""),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
}));

export const versions = pgTable("versions", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").references(() => packages.id).notNull(),
  version: text("version").notNull(),
  readme: text("readme").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stars = pgTable("stars", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  packageId: integer("package_id").references(() => packages.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
