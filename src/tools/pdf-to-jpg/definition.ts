import { ToolDefinition } from "@/tools/types";

export const pdfToJpgTool: ToolDefinition = {
  id: "pdf-to-jpg",
  slug: "pdf-to-jpg",
  icon: "image",
  categoryId: "pdf",
  keywords: ["pdf", "jpg", "jpeg", "converter", "extract", "dönüştür", "ayır"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T01:05:00Z",
  seo: {
    tr: {
      title: "PDF'i JPG'ye Çevir | PDF to JPG | AuraConvert",
      description: "PDF sayfalarınızı yüksek kaliteli JPG görsellerine dönüştürün. Ücretsiz, programsız ve tarayıcınızda %100 güvenli çalışır."
    },
    en: {
      title: "Convert PDF to JPG | Extract Pages | AuraConvert",
      description: "Convert your PDF pages into high-quality JPG images. Free, secure, and runs entirely in your browser without uploads."
    }
  },
  load: () => import("./PdfToJpgTool").then((m) => ({ default: m.PdfToJpgTool })),
};
