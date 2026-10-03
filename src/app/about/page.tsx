"use client";

import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";

export default function AboutPage() {
  const { locale } = useTranslations();
  const isTr = locale === "tr";

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 animate-fade-in pb-24">
      <div className="mb-12 space-y-4 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-xl shadow-primary-500/20 mb-4">
          <Icon name="star" className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {isTr ? "Hakkımızda" : "About Us"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isTr 
            ? "Tüm araçların tek bir platformda buluştuğu modern, hızlı ve güvenli ekosistem."
            : "The modern, fast, and secure ecosystem where all tools meet in one platform."}
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <div className="rounded-3xl border border-border glass bg-card/50 p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {isTr ? "AuraConvert Nedir?" : "What is AuraConvert?"}
          </h2>
          <p className="mb-6">
            {isTr
              ? "AuraConvert, günlük dijital iş akışınızı hızlandırmak için tasarlanmış yeni nesil bir tarayıcı tabanlı araç platformudur. Görsel işleme, PDF yönetimi, metin araçları ve geliştirici yardımcı programlarını tek bir çatı altında, tek bir tasarım dilinde topluyoruz."
              : "AuraConvert is a next-generation browser-based tools platform designed to accelerate your daily digital workflow. We bring image processing, PDF management, text tools, and developer utilities under one roof, using a single design language."}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
            {isTr ? "Misyonumuz" : "Our Mission"}
          </h2>
          <p>
            {isTr
              ? "Çoğu çevrimiçi araç platformunun aksine AuraConvert, kullanıcı gizliliğine ve performansa öncelik verir. Araçlarımızın çoğu verilerinizi herhangi bir sunucuya göndermeden doğrudan tarayıcınızda (client-side) çalışır. Hedefimiz, kayıt olmadan, sınırsız ve ücretsiz bir şekilde en iyi araç deneyimini sunmaktır."
              : "Unlike most online tool platforms, AuraConvert prioritizes user privacy and performance. Most of our tools run directly in your browser (client-side) without sending your data to any server. Our goal is to provide the best tool experience for free, with no registration required and unlimited usage."}
          </p>
        </div>
      </div>
    </div>
  );
}
