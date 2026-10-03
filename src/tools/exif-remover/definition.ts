import { ToolDefinition } from "@/tools/types";

export const exifRemoverTool: ToolDefinition = {
  id: "exif-remover",
  slug: "exif-remover",
  icon: "shield",
  categoryId: "image",
  keywords: ["exif", "metadata", "remove", "sil", "temizle", "gps", "privacy"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-03T10:20:00Z",
  seo: {
    tr: {
      title: "EXIF Temizleyici | Metadata Sil | AuraConvert",
      description: "Görsellerinizdeki gizli EXIF, GPS ve kamera meta verilerini tek tıkla silin. %100 gizlilik garantisi."
    },
    en: {
      title: "EXIF Remover | Remove Metadata | AuraConvert",
      description: "Remove hidden EXIF, GPS, and camera metadata from your images in one click. 100% privacy guaranteed."
    }
  },
  load: () => import("./ExifRemoverTool").then((m) => ({ default: m.ExifRemoverTool })),
};
