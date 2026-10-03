import { ToolDefinition } from "@/tools/types";

export const imageMergerTool: ToolDefinition = {
  id: "image-merger",
  slug: "image-merger",
  icon: "layout",
  categoryId: "image",
  keywords: ["image", "merge", "birleştir", "fotoğraf", "kolaj", "collage", "grid"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T10:10:00Z",
  seo: {
    tr: {
      title: "Görsel Birleştirici | Image Merger | AuraConvert",
      description: "Birden fazla görseli yan yana, alt alta veya grid formatında tek bir dosyada birleştirin. Tarayıcınızda ücretsiz."
    },
    en: {
      title: "Image Merger | Combine Photos | AuraConvert",
      description: "Merge multiple images horizontally, vertically, or in a grid format. Free and secure in your browser."
    }
  },
  load: () => import("./ImageMergerTool").then((m) => ({ default: m.ImageMergerTool })),
};
