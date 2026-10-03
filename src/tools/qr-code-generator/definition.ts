import { ToolDefinition } from "@/tools/types";

export const qrCodeGeneratorTool: ToolDefinition = {
  id: "qr-code-generator",
  slug: "qr-code-generator",
  icon: "qr-code",
  categoryId: "utility",
  keywords: ["qr", "qrcode", "generator", "oluşturucu", "karekod", "barcode"],
  runtime: "client",
  computeTarget: "main",
  supportedLocales: ["tr", "en"],
  popular: true,
  featured: false,
  addedAt: "2026-10-02T21:00:00Z",
  seo: {
    tr: {
      title: "QR Kod Oluşturucu | AuraConvert",
      description: "Metin veya URL girerek anında yüksek kaliteli QR kod oluşturun ve PNG/SVG olarak indirin. %100 gizlilikle tarayıcınızda çalışır."
    },
    en: {
      title: "QR Code Generator | AuraConvert",
      description: "Instantly generate high-quality QR codes from text or URLs. Download as PNG or SVG with 100% privacy in your browser."
    }
  },
  load: () => import("./QrCodeGeneratorTool").then((m) => ({ default: m.QrCodeGeneratorTool })),
};
