import { ToolDefinition } from "@/tools/types";

export const jwtDecoderTool: ToolDefinition = {
  id: "jwt-decoder",
  slug: "jwt-decoder",
  icon: "key",
  categoryId: "developer",
  keywords: ["jwt", "decoder", "json", "web", "token", "çözücü", "parse", "base64url", "security"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: false,
  featured: false,
  addedAt: "2026-10-02T23:45:00Z",
  seo: {
    tr: {
      title: "JWT Çözücü | JSON Web Token Decoder | AuraConvert",
      description: "JWT (JSON Web Token) değerlerinizi %100 gizlilikle tarayıcınızda çözün. Header, Payload ve Signature alanlarını anında inceleyin."
    },
    en: {
      title: "JWT Decoder | JSON Web Token Decoder | AuraConvert",
      description: "Decode JWT (JSON Web Token) values with 100% privacy in your browser. Inspect Header, Payload, and Signature instantly."
    }
  },
  load: () => import("./JwtDecoderTool").then((m) => ({ default: m.JwtDecoderTool })),
};
