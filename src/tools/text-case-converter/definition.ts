import { ToolDefinition } from "@/tools/types";

export const textCaseConverterTool: ToolDefinition = {
  id: "text-case-converter",
  slug: "text-case-converter",
  icon: "text",
  categoryId: "text",
  keywords: ["text", "case", "converter", "uppercase", "lowercase", "camelcase", "harf", "dönüştürücü", "büyük", "küçük"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-02T21:00:00Z",
  seo: {
    tr: {
      title: "Metin Harf Dönüştürücü | AuraConvert",
      description: "Metinlerinizi BÜYÜK HARF, küçük harf, camelCase ve diğer formatlara anında dönüştürün. Tarayıcınızda %100 gizlilikle çalışır."
    },
    en: {
      title: "Text Case Converter | AuraConvert",
      description: "Instantly convert your text to UPPERCASE, lowercase, camelCase, and more. Works in your browser with 100% privacy."
    }
  },
  load: () => import("./TextCaseConverterTool").then((m) => ({ default: m.TextCaseConverterTool })),
};
