import { ToolDefinition } from "@/tools/types";

export const pdfSplitterTool: ToolDefinition = {
  id: "pdf-splitter",
  slug: "pdf-splitter",
  icon: "file-text",
  categoryId: "pdf",
  keywords: ["pdf", "splitter", "bölücü", "sayfa", "ayır", "extract", "pages"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-02T23:50:00Z",
  seo: {
    tr: {
      title: "PDF Bölücü | PDF Splitter | AuraConvert",
      description: "PDF dosyalarınızdan istediğiniz sayfaları seçin ve yeni PDF'ler olarak kaydedin. %100 gizlilikle tarayıcınızda ücretsiz çalışır."
    },
    en: {
      title: "PDF Splitter | Extract PDF Pages | AuraConvert",
      description: "Select and extract pages from your PDF files. Export them as new PDF files securely in your browser for free."
    }
  },
  load: () => import("./PdfSplitterTool").then((m) => ({ default: m.PdfSplitterTool })),
};
