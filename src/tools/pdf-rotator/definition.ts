import { ToolDefinition } from "@/tools/types";

export const pdfRotatorTool: ToolDefinition = {
  id: "pdf-rotator",
  slug: "pdf-rotator",
  icon: "refresh-cw",
  categoryId: "pdf",
  keywords: ["pdf", "rotator", "döndür", "sayfa", "rotate", "çevir"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-03T01:10:00Z",
  seo: {
    tr: {
      title: "PDF Döndürücü | PDF Sayfa Döndür | AuraConvert",
      description: "PDF dosyalarınızdaki sayfaları 90 derece, 180 derece veya 270 derece döndürün. Ücretsiz, programsız ve tarayıcınızda çalışır."
    },
    en: {
      title: "PDF Rotator | Rotate PDF Pages | AuraConvert",
      description: "Rotate pages in your PDF files by 90, 180, or 270 degrees. Free, secure, and runs entirely in your browser without uploads."
    }
  },
  load: () => import("./PdfRotatorTool").then((m) => ({ default: m.PdfRotatorTool })),
};
