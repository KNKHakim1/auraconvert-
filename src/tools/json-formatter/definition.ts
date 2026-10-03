import type { ToolDefinition } from "@/tools/types";

export const jsonFormatterTool: ToolDefinition = {
  id: "json-formatter",
  slug: "json-formatter",
  icon: "developer",
  categoryId: "developer",
  keywords: ["json", "formatter", "validator", "biçimlendirici", "doğrulayıcı", "minify", "pretty"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-09-30T12:00:00Z",
  seo: {
    tr: {
      title: "JSON Biçimlendirici ve Doğrulayıcı",
      description: "JSON verilerinizi formatlayın, doğrulayın, minify edin ve hataları tarayıcınızda bulun."
    },
    en: {
      title: "JSON Formatter & Validator",
      description: "Format, validate, minify, and debug your JSON data directly in your browser."
    }
  },
  load: () => import("./JsonFormatterTool").then((m) => ({ default: m.JsonFormatterTool })),
};
