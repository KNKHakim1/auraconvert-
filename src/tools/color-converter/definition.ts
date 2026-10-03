import { ToolDefinition } from "@/tools/types";

export const colorConverterTool: ToolDefinition = {
  id: "color-converter",
  slug: "color-converter",
  icon: "palette",
  categoryId: "developer",
  keywords: ["color", "converter", "renk", "dönüştürücü", "hex", "rgb", "hsl", "palette"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-02T23:00:00Z",
  seo: {
    tr: {
      title: "Renk Dönüştürücü | HEX, RGB, HSL | AuraConvert",
      description: "Renk kodlarınızı anında HEX, RGB ve HSL formatları arasında dönüştürün. Ücretsiz canlı önizleme ve palet aracı."
    },
    en: {
      title: "Color Converter | HEX, RGB, HSL | AuraConvert",
      description: "Instantly convert color codes between HEX, RGB, and HSL formats with live preview and color picker tool."
    }
  },
  load: () => import("./ColorConverterTool").then((m) => ({ default: m.ColorConverterTool })),
};
