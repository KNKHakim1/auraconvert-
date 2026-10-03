import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllTools } from "@/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const routes = [
    "",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: tool.addedAt || new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...routes, ...toolRoutes];
}
