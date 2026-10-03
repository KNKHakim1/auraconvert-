import type { ToolDefinition } from "@/tools/types";

export const imageResizerTool: ToolDefinition = {
  id: "image-resizer",
  slug: "image-resizer",
  icon: "image",
  categoryId: "image",
  keywords: ["boyut", "kırp", "küçült", "büyüt", "resize", "scale", "image", "fotoğraf"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-09-29T12:05:00Z",
  seo: {
    tr: {
      title: "Görsel Boyutlandırıcı",
      description: "Genişlik ve yüksekliği ayarlayarak görselleri kırpın ve boyutlandırın."
    },
    en: {
      title: "Image Resizer",
      description: "Resize and scale images by adjusting width and height instantly."
    }
  },
  load: () => import("./ImageResizerTool").then((m) => ({ default: m.ImageResizerTool })),
};
