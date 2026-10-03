import { ToolDefinition } from "@/tools/types";

export const imageCropperTool: ToolDefinition = {
  id: "image-cropper",
  slug: "image-cropper",
  icon: "crop",
  categoryId: "image",
  keywords: ["image", "crop", "kırp", "fotoğraf", "kes", "boyutlandır"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T10:00:00Z",
  seo: {
    tr: {
      title: "Fotoğraf Kırpıcı | Image Cropper | AuraConvert",
      description: "Görsellerinizi istediğiniz oranda ve boyutta kırpın. Ücretsiz, %100 güvenli ve tarayıcınızda çalışır."
    },
    en: {
      title: "Image Cropper | Crop Photos | AuraConvert",
      description: "Crop your images to any aspect ratio and size. Free, 100% secure, and runs in your browser."
    }
  },
  load: () => import("./ImageCropperTool").then((m) => ({ default: m.ImageCropperTool })),
};
