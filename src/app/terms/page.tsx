"use client";

import { useTranslations } from "@/i18n/use-translations";

export default function TermsPage() {
  const { locale } = useTranslations();
  const isTr = locale === "tr";

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 animate-fade-in pb-24">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {isTr ? "Kullanım Şartları" : "Terms of Service"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isTr ? "Kurallar kısa ve özdür." : "The rules are short and simple."}
        </p>
      </div>

      <div className="rounded-3xl border border-border glass bg-card/50 p-8 sm:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "1. Hizmet Kullanımı" : "1. Use of Service"}</h2>
          <p>
            {isTr
              ? "AuraConvert platformu ve barındırdığı tüm araçlar tamamen ücretsiz olarak sağlanmaktadır. Hizmeti kişisel veya ticari işleriniz için dilediğiniz gibi kullanabilirsiniz."
              : "The AuraConvert platform and all its hosted tools are provided completely free of charge. You may use the service for personal or commercial purposes as you wish."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "2. Sorumluluk Reddi" : "2. Disclaimer"}</h2>
          <p>
            {isTr
              ? "Araçlarımızın çıktılarının doğruluğu, bütünlüğü veya cihazınıza uygunluğu garanti edilmez. Ürettiğiniz, dönüştürdüğünüz veya sıkıştırdığınız dosyaların yedeğini almak sizin sorumluluğunuzdadır. AuraConvert, olası bir veri kaybından sorumlu tutulamaz."
              : "We do not guarantee the accuracy, integrity, or suitability of our tools' outputs. It is your responsibility to back up the files you generate, convert, or compress. AuraConvert cannot be held liable for any potential data loss."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "3. Kötüye Kullanım" : "3. Abuse"}</h2>
          <p>
            {isTr
              ? "Platformu yasadışı faaliyetler için kullanamazsınız. API'lerimize otomatik veya zararlı bot saldırıları düzenlemek yasaktır. Hizmeti herkesin sağlıklı kullanabilmesi adına adil kullanım sınırlarına saygı gösterilmelidir."
              : "You may not use the platform for illegal activities. Automated or malicious bot attacks against our APIs are prohibited. Fair use limits must be respected so that everyone can use the service healthily."}
          </p>
        </section>
      </div>
    </div>
  );
}
