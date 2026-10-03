import type { ToolDefinition } from "@/tools/types";

export const faviconGeneratorTool: ToolDefinition = {
  id: "favicon-generator",
  slug: "favicon-generator",
  icon: "image", // can be changed if there is a better icon
  categoryId: "image",
  keywords: ["favicon", "ico", "generator", "app icon", "oluşturucu", "sekme ikonu"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-09-30T10:30:00Z",
  seo: {
    tr: {
      title: "Favicon Oluşturucu",
      description: "Siteniz için tüm cihazlarla uyumlu PNG ve ICO formatında favicon seti oluşturun."
    },
    en: {
      title: "Favicon Generator",
      description: "Generate a complete set of PNG and ICO favicons for your website compatible with all devices."
    }
  },
  load: () => import("./FaviconGeneratorTool").then((m) => ({ default: m.FaviconGeneratorTool })),
};
