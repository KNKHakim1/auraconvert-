import type { ToolDefinition } from "@/tools/types";

export const imageCompressorTool: ToolDefinition = {
  id: "image-compressor",
  slug: "image-compressor",
  icon: "image",
  categoryId: "image",
  keywords: ["sıkıştır", "küçült", "boyut", "kalite", "compress", "tiny", "jpeg", "webp"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-09-29T12:00:00Z",
  seo: {
    tr: {
      title: "Görsel Sıkıştırıcı",
      description: "Görsellerinizin boyutunu kaliteden ödün vermeden tarayıcınızda küçültün."
    },
    en: {
      title: "Image Compressor",
      description: "Reduce image file size directly in your browser without losing quality."
    }
  },
  load: () => import("./ImageCompressorTool").then((m) => ({ default: m.ImageCompressorTool })),
};
