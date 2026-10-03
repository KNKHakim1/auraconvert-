import type { ToolDefinition } from "@/tools/types";

export const characterCounterTool: ToolDefinition = {
  id: "character-counter",
  slug: "character-counter",
  categoryId: "text",
  icon: "character-counter",
  keywords: [
    "karakter",
    "kelime",
    "satir",
    "sayac",
    "metin",
    "character",
    "word",
    "line",
    "counter",
    "text",
  ],
  supportedLocales: ["tr", "en"],
  runtime: "client",
  computeTarget: "main",
  popular: true,
  featured: true,
  addedAt: "2026-09-29",
  seo: {
    tr: {
      title: "Karakter Sayacı",
      description:
        "Metindeki karakter, kelime ve satır sayısını tarayıcınızda anında hesaplayın. Dosya yüklemesi gerekmez.",
    },
    en: {
      title: "Character Counter",
      description:
        "Count characters, words, and lines in your text instantly in the browser. No file upload required.",
    },
  },
  load: () => import("./CharacterCounterTool"),
};
