import type { ToolDefinition } from "@/tools/types";

export const backgroundRemoverTool: ToolDefinition = {
  id: "background-remover",
  slug: "background-remover",
  icon: "image",
  categoryId: "image",
  keywords: ["arka", "plan", "sil", "kaldır", "background", "remover", "transparent", "png", "ai"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: true,
  addedAt: "2026-09-29T12:10:00Z",
  seo: {
    tr: {
      title: "Arka Plan Kaldırıcı",
      description: "Yapay zeka ile saniyeler içinde fotoğrafların arka planını silin."
    },
    en: {
      title: "Background Remover",
      description: "Remove image backgrounds in seconds using on-device AI."
    }
  },
  load: () => import("./BackgroundRemoverTool").then((m) => ({ default: m.BackgroundRemoverTool })),
};
