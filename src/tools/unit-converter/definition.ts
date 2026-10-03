import { ToolDefinition } from "@/tools/types";

export const unitConverterTool: ToolDefinition = {
  id: "unit-converter",
  slug: "unit-converter",
  icon: "arrow-right-left",
  categoryId: "math",
  keywords: ["unit", "converter", "birim", "dönüştürücü", "uzunluk", "ağırlık", "ölçü"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T12:00:00Z",
  seo: {
    tr: {
      title: "Birim Dönüştürücü | Uzunluk, Ağırlık, Sıcaklık | AuraConvert",
      description: "Uzunluk, ağırlık, sıcaklık, alan, hacim ve zaman birimlerini anında birbirine çevirin. Ücretsiz online birim dönüştürücü."
    },
    en: {
      title: "Unit Converter | Length, Weight, Temp | AuraConvert",
      description: "Instantly convert length, weight, temperature, area, volume, and time units. Free online unit converter tool."
    }
  },
  load: () => import("./UnitConverterTool").then((m) => ({ default: m.UnitConverterTool })),
};
