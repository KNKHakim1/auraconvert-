import { ToolDefinition } from "@/tools/types";

export const dateDifferenceTool: ToolDefinition = {
  id: "date-difference",
  slug: "date-difference",
  icon: "calendar",
  categoryId: "math",
  keywords: ["date", "difference", "tarih", "farkı", "gün", "hesaplayıcı", "zaman", "time"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T12:05:00Z",
  seo: {
    tr: {
      title: "Tarih Farkı Hesaplayıcı | İki Tarih Arası Kaç Gün | AuraConvert",
      description: "İki tarih arasındaki toplam gün, hafta, ay ve iş günü sayısını anında hesaplayın. Ücretsiz online tarih farkı aracı."
    },
    en: {
      title: "Date Difference Calculator | Days Between Dates | AuraConvert",
      description: "Calculate the total days, weeks, months, and workdays between two dates instantly. Free online date diff tool."
    }
  },
  load: () => import("./DateDifferenceTool").then((m) => ({ default: m.DateDifferenceTool })),
};
