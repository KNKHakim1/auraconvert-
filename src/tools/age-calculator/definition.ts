import { ToolDefinition } from "@/tools/types";

export const ageCalculatorTool: ToolDefinition = {
  id: "age-calculator",
  slug: "age-calculator",
  icon: "calendar",
  categoryId: "math",
  keywords: ["age", "yaş", "hesaplama", "doğum", "günü", "tarih", "birthday", "date"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T11:10:00Z",
  seo: {
    tr: {
      title: "Yaş Hesaplama | Tam Yaşını Öğren | AuraConvert",
      description: "Tam yaşınızı yıl, ay ve gün olarak anında hesaplayın. Bir sonraki doğum gününüze kaç gün kaldığını öğrenin."
    },
    en: {
      title: "Age Calculator | Calculate Exact Age | AuraConvert",
      description: "Instantly calculate your exact age in years, months, and days. Find out how many days until your next birthday."
    }
  },
  load: () => import("./AgeCalculatorTool").then((m) => ({ default: m.AgeCalculatorTool })),
};
