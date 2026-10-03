import type { ToolDefinition } from "@/tools/types";

export const watermarkRemoverTool: ToolDefinition = {
  id: "watermark-remover",
  slug: "watermark-remover",
  icon: "eraser",
  categoryId: "image",
  keywords: ["filigran", "kaldırıcı", "silme", "obje silme", "watermark", "remove", "inpaint"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-09-30T10:00:00Z",
  seo: {
    tr: {
      title: "Filigran Kaldırıcı",
      description: "Görsellerinizin üzerindeki istenmeyen yazıları, logoları veya objeleri silin."
    },
    en: {
      title: "Watermark Remover",
      description: "Remove unwanted text, logos, or objects from your images."
    }
  },
  load: () => import("./WatermarkRemoverTool").then((m) => ({ default: m.WatermarkRemoverTool })),
};
