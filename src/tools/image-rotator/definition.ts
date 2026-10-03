import { ToolDefinition } from "@/tools/types";

export const imageRotatorTool: ToolDefinition = {
  id: "image-rotator",
  slug: "image-rotator",
  icon: "rotate-cw",
  categoryId: "image",
  keywords: ["image", "rotator", "fotoğraf", "döndürücü", "çevir", "flip", "rotate"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T19:05:00Z",
  seo: {
    tr: {
      title: "Fotoğraf Döndürücü & Çevirici | Online Araç | AuraConvert",
      description: "Görsellerinizi istediğiniz yöne (90°, 180°) döndürün veya yatay/dikey olarak aynalayın. Kalite kaybı olmadan JPG, PNG indirin."
    },
    en: {
      title: "Image Rotator & Flipper | Free Online Tool | AuraConvert",
      description: "Rotate images (90°, 180°) or flip them horizontally/vertically. Download as JPG or PNG with no quality loss."
    }
  },
  load: () => import("./ImageRotatorTool").then((m) => ({ default: m.ImageRotatorTool })),
};
