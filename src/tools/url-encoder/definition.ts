import { ToolDefinition } from "@/tools/types";

export const urlEncoderTool: ToolDefinition = {
  id: "url-encoder",
  slug: "url-encoder",
  icon: "link",
  categoryId: "developer",
  keywords: ["url", "encode", "decode", "converter", "dönüştürücü", "çözücü", "link", "uri"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-02T22:30:00Z",
  seo: {
    tr: {
      title: "URL Encode / Decode | AuraConvert",
      description: "URL ve metinlerinizi güvenle Encode edin veya Encode edilmiş verileri çözün. %100 gizlilikle tarayıcınızda çalışır."
    },
    en: {
      title: "URL Encoder / Decoder | AuraConvert",
      description: "Encode text to URL-safe format or decode URL-encoded strings instantly. Works securely in your browser with 100% privacy."
    }
  },
  load: () => import("./UrlEncoderTool").then((m) => ({ default: m.UrlEncoderTool })),
};
