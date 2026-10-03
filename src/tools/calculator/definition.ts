import { ToolDefinition } from "@/tools/types";

export const calculatorTool: ToolDefinition = {
  id: "calculator",
  slug: "calculator",
  icon: "calculator",
  categoryId: "math",
  keywords: ["calculator", "hesap", "makinesi", "math", "matematik", "toplama"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T11:00:00Z",
  seo: {
    tr: {
      title: "Hesap Makinesi | Online Calculator | AuraConvert",
      description: "Günlük matematiksel işlemleriniz için güvenli, hızlı ve kullanımı kolay online hesap makinesi. Tamamen tarayıcınızda çalışır."
    },
    en: {
      title: "Online Calculator | Free Math Tool | AuraConvert",
      description: "Safe, fast, and easy-to-use online calculator for your daily mathematical operations. Works entirely in your browser."
    }
  },
  load: () => import("./CalculatorTool").then((m) => ({ default: m.CalculatorTool })),
};
