import { ToolDefinition } from "@/tools/types";

export const pdfMergerTool: ToolDefinition = {
  id: "pdf-merger",
  slug: "pdf-merger",
  icon: "files",
  categoryId: "pdf",
  keywords: ["pdf", "merger", "birleştir", "combine", "join"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-02T20:00:00Z",
  seo: {
    tr: {
      title: "PDF Birleştirici | AuraConvert",
      description: "Birden fazla PDF dosyasını tek bir belge haline getirin. %100 gizlilikle tarayıcınızda sıralayın ve birleştirin."
    },
    en: {
      title: "PDF Merger | AuraConvert",
      description: "Merge multiple PDF files into a single document. Reorder and combine with 100% privacy directly in your browser."
    }
  },
  load: () => import("./PdfMergerTool").then((m) => ({ default: m.PdfMergerTool })),
};
