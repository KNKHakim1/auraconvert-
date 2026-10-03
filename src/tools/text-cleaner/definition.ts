import { ToolDefinition } from "@/tools/types";

export const textCleanerTool: ToolDefinition = {
  id: "text-cleaner",
  slug: "text-cleaner",
  icon: "eraser",
  categoryId: "text",
  keywords: ["text", "cleaner", "metin", "temizleyici", "boşluk", "sil", "satır"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T19:10:00Z",
  seo: {
    tr: {
      title: "Metin Temizleyici | Boşluk ve Satır Silici | AuraConvert",
      description: "Fazla boşlukları, boş satırları, sekmeleri (tab) saniyeler içinde temizleyin. Metinlerinizi online olarak anında düzenleyin."
    },
    en: {
      title: "Text Cleaner | Remove Extra Spaces & Lines | AuraConvert",
      description: "Clean up extra spaces, empty lines, and tabs in seconds. Format and normalize your text instantly online."
    }
  },
  load: () => import("./TextCleanerTool").then((m) => ({ default: m.TextCleanerTool })),
};
