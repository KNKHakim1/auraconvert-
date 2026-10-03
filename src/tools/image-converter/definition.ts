import type { ToolDefinition } from "@/tools/types";

export const imageConverterTool: ToolDefinition = {
  id: "image-converter",
  slug: "image-converter",
  icon: "image",
  categoryId: "image",
  keywords: ["dönüştür", "çevir", "format", "jpg", "png", "webp", "avif"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-09-29T12:00:00Z",
  seo: {
    tr: {
      title: "Görsel Dönüştürücü",
      description: "Görsellerinizi JPG, PNG, WebP ve AVIF formatlarına dönüştürün."
    },
    en: {
      title: "Image Converter",
      description: "Convert your images to JPG, PNG, WebP, and AVIF formats."
    }
  },
  load: () => import("./ImageConverterTool").then((m) => ({ default: m.ImageConverterTool })),
};
