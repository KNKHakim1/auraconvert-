import { ToolDefinition } from "@/tools/types";

export const percentageCalculatorTool: ToolDefinition = {
  id: "percentage-calculator",
  slug: "percentage-calculator",
  icon: "percent",
  categoryId: "math",
  keywords: ["percentage", "yüzde", "hesaplama", "indirim", "kdv", "artış", "azalış", "discount"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T11:05:00Z",
  seo: {
    tr: {
      title: "Yüzde Hesaplama | KDV ve İndirim Hesaplayıcı | AuraConvert",
      description: "Kolayca yüzde bulma, yüzde değişim, KDV ve indirim hesaplama araçları. Tarayıcınızda ücretsiz yüzde hesaplayıcı."
    },
    en: {
      title: "Percentage Calculator | Discount & VAT | AuraConvert",
      description: "Easily find percentages, percentage changes, VAT, and calculate discounts. Free online percentage calculator."
    }
  },
  load: () => import("./PercentageCalculatorTool").then((m) => ({ default: m.PercentageCalculatorTool })),
};
