import { ToolDefinition } from "@/tools/types";

export const passwordGeneratorTool: ToolDefinition = {
  id: "password-generator",
  slug: "password-generator",
  icon: "key",
  categoryId: "utility",
  keywords: ["password", "generator", "şifre", "oluşturucu", "parola", "güvenli", "secure"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: true,
  addedAt: "2026-10-02T19:00:00Z",
  seo: {
    tr: {
      title: "Güçlü Şifre Oluşturucu | AuraConvert",
      description: "Gelişmiş algoritmalarla güvenli, kırılması zor ve rastgele şifreler üretin. %100 gizlilik garantisiyle tarayıcınızda çalışır."
    },
    en: {
      title: "Strong Password Generator | AuraConvert",
      description: "Generate secure, hard-to-crack random passwords using advanced algorithms directly in your browser."
    }
  },
  load: () => import("./PasswordGeneratorTool").then((m) => ({ default: m.PasswordGeneratorTool })),
};
