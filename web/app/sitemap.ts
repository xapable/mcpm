import { db } from "@/db";
import { packages } from "@/db/schema";
import { getAllPosts } from "@/lib/content";
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.mcpm.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/publish`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cli-login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic package routes
  const allPackages = await db
    .select({ name: packages.name, updatedAt: packages.createdAt })
    .from(packages);

  const packageRoutes: MetadataRoute.Sitemap = allPackages.map((pkg) => ({
    url: `${BASE_URL}/package/${pkg.name}`,
    lastModified: pkg.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Blog & tutorial routes
  const blogPosts = getAllPosts("blog");
  const tutorialPosts = getAllPosts("tutorial");

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tutorialRoutes: MetadataRoute.Sitemap = tutorialPosts.map((post) => ({
    url: `${BASE_URL}/tutorials/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes, ...tutorialRoutes];
}
