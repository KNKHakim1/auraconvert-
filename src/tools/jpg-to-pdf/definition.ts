import { ToolDefinition } from "@/tools/types";

export const jpgToPdfTool: ToolDefinition = {
  id: "jpg-to-pdf",
  slug: "jpg-to-pdf",
  icon: "image",
  categoryId: "pdf",
  keywords: ["jpg", "jpeg", "pdf", "converter", "merge", "birleştir", "dönüştür"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T01:00:00Z",
  seo: {
    tr: {
      title: "JPG'yi PDF'e Çevir | JPG to PDF | AuraConvert",
      description: "JPG ve JPEG görsellerinizi tek bir PDF dosyasında kolayca birleştirin. Tarayıcınızda çalışan, ücretsiz ve %100 güvenli JPG to PDF dönüştürücü."
    },
    en: {
      title: "Convert JPG to PDF | Merge Images | AuraConvert",
      description: "Easily merge your JPG and JPEG images into a single PDF file. Free and 100% secure client-side JPG to PDF converter."
    }
  },
  load: () => import("./JpgToPdfTool").then((m) => ({ default: m.JpgToPdfTool })),
};
