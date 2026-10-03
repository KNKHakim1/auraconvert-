import { ToolDefinition } from "@/tools/types";

export const pdfTextExtractorTool: ToolDefinition = {
  id: "pdf-text-extractor",
  slug: "pdf-text-extractor",
  icon: "file-text",
  categoryId: "pdf",
  keywords: ["pdf", "text", "extractor", "metin", "çıkarıcı", "yazı", "kopyala", "ocr"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T19:00:00Z",
  seo: {
    tr: {
      title: "PDF'den Metin Çıkarıcı | Ücretsiz Online Araç | AuraConvert",
      description: "PDF dosyalarınızın içindeki metinleri tarayıcınızda güvenle ve ücretsiz çıkarın. Seçili sayfa veya tüm PDF'den TXT'ye çevirin."
    },
    en: {
      title: "PDF Text Extractor | Free Online Tool | AuraConvert",
      description: "Extract text from your PDF files entirely in your browser securely and for free. Export all pages or specific pages to TXT."
    }
  },
  load: () => import("./PdfTextExtractorTool").then((m) => ({ default: m.PdfTextExtractorTool })),
};
