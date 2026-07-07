import { pgTable, text, integer, timestamp, serial, index, primaryKey, jsonb } from "drizzle-orm/pg-core";

// NextAuth tables
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  username: text("username"),
});

export const accounts = pgTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const packages = pgTable("package", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").default(""),
  userId: text("userId").references(() => users.id).notNull(),
  repoUrl: text("repoUrl").default(""),
  downloads: integer("downloads").default(0),
  mcp: jsonb("mcp"),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
}));

export const versions = pgTable("version", {
  id: serial("id").primaryKey(),
  packageId: integer("packageId").references(() => packages.id).notNull(),
  version: text("version").notNull(),
  readme: text("readme").default(""),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const stars = pgTable("star", {
  id: serial("id").primaryKey(),
  userId: text("userId").references(() => users.id).notNull(),
  packageId: integer("packageId").references(() => packages.id).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
