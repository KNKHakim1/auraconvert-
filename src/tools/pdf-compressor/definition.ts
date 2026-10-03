import type { ToolDefinition } from "@/tools/types";

export const pdfCompressorTool: ToolDefinition = {
  id: "pdf-compressor",
  slug: "pdf-compressor",
  icon: "pdf",
  categoryId: "pdf",
  keywords: ["pdf", "compress", "sıkıştır", "reduce size", "boyut küçült", "optimize"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-09-30T12:00:00Z",
  seo: {
    tr: {
      title: "PDF Sıkıştırıcı | Dosya Boyutunu Küçült",
      description: "PDF dosyalarınızı tarayıcınızda, sunucuya yüklemeden güvenle sıkıştırın ve küçültün."
    },
    en: {
      title: "PDF Compressor | Reduce PDF File Size",
      description: "Compress and reduce your PDF file size securely in your browser without uploading to a server."
    }
  },
  load: () => import("./PdfCompressorTool").then((m) => ({ default: m.PdfCompressorTool })),
};
