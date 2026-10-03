import { ToolDefinition } from "@/tools/types";

export const base64Tool: ToolDefinition = {
  id: "base64",
  slug: "base64-converter",
  icon: "hash",
  categoryId: "developer",
  keywords: ["base64", "encode", "decode", "converter", "dönüştürücü", "çözücü", "şifreleme", "metin"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-02T22:00:00Z",
  seo: {
    tr: {
      title: "Base64 Dönüştürücü | AuraConvert",
      description: "Metinleri Base64 formatına çevirin veya Base64 verilerini hızlıca çözün. Unicode destekli, %100 gizlilikle tarayıcınızda çalışır."
    },
    en: {
      title: "Base64 Converter | AuraConvert",
      description: "Encode text to Base64 or decode Base64 strings instantly. Unicode supported, works securely in your browser with 100% privacy."
    }
  },
  load: () => import("./Base64Tool").then((m) => ({ default: m.Base64Tool })),
};
