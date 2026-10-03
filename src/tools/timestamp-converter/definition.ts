import { ToolDefinition } from "@/tools/types";

export const timestampConverterTool: ToolDefinition = {
  id: "timestamp-converter",
  slug: "timestamp-converter",
  icon: "clock",
  categoryId: "developer",
  keywords: ["timestamp", "unix", "date", "time", "converter", "epoch", "tarih", "saat", "dönüştürücü"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-02T23:30:00Z",
  seo: {
    tr: {
      title: "Unix Timestamp Dönüştürücü | AuraConvert",
      description: "Unix timestamp (epoch) değerlerini saniye veya milisaniye bazında normal tarih ve saate dönüştürün. Tarayıcınızda anında çalışır."
    },
    en: {
      title: "Unix Timestamp Converter | AuraConvert",
      description: "Convert Unix timestamp (epoch) values to human-readable dates in seconds or milliseconds. Works instantly in your browser."
    }
  },
  load: () => import("./TimestampConverterTool").then((m) => ({ default: m.TimestampConverterTool })),
};
