import { ToolDefinition } from "@/tools/types";

export const stopwatchTool: ToolDefinition = {
  id: "stopwatch",
  slug: "stopwatch",
  icon: "timer",
  categoryId: "math",
  keywords: ["stopwatch", "timer", "kronometre", "zamanlayıcı", "alarm", "lap", "tur"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-03T12:10:00Z",
  seo: {
    tr: {
      title: "Kronometre ve Zamanlayıcı | Online Stopwatch | AuraConvert",
      description: "Tur kaydedebilen hassas online kronometre ve alarmlı zamanlayıcı aracı. Arka planda bile güvenle çalışır."
    },
    en: {
      title: "Online Stopwatch & Timer with Alarm | AuraConvert",
      description: "Precise online stopwatch with lap recording and a timer with alarm. Works reliably even in background tabs."
    }
  },
  load: () => import("./StopwatchTool").then((m) => ({ default: m.StopwatchTool })),
};
