"use client";

import { useTranslations } from "@/i18n/use-translations";

export default function PrivacyPage() {
  const { locale } = useTranslations();
  const isTr = locale === "tr";

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 animate-fade-in pb-24">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isTr ? "Verileriniz bizim değil, sizin." : "Your data is yours, not ours."}
        </p>
      </div>

      <div className="rounded-3xl border border-border glass bg-card/50 p-8 sm:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "1. Veri İşleme (Client-Side İlkeleri)" : "1. Data Processing (Client-Side Principles)"}</h2>
          <p>
            {isTr
              ? "AuraConvert'nın temel prensibi gizliliktir. Görsel sıkıştırma, PDF düzenleme, metin analizi ve diğer araçlarımızın büyük çoğunluğu tamamen tarayıcınızın içinde (client-side) çalışır. Bu sayede dosyalarınız hiçbir zaman sunucularımıza yüklenmez ve cihazınızdan dışarı çıkmaz."
              : "AuraConvert's core principle is privacy. The vast majority of our tools, including image compression, PDF editing, and text analysis, run entirely within your browser (client-side). This means your files are never uploaded to our servers and never leave your device."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "2. Çerezler ve Analitik" : "2. Cookies and Analytics"}</h2>
          <p>
            {isTr
              ? "Platformumuz, deneyiminizi iyileştirmek için yalnızca tema tercihiniz gibi zorunlu yerel ayarları (localStorage) kullanır. Sizi kişisel olarak tanımlayabilecek hiçbir reklam çerezi veya üçüncü taraf takipçisi barındırmıyoruz."
              : "Our platform only uses necessary local settings (localStorage), such as your theme preference, to improve your experience. We do not host any advertising cookies or third-party trackers that could personally identify you."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{isTr ? "3. Üçüncü Taraf Bağlantılar" : "3. Third-Party Links"}</h2>
          <p>
            {isTr
              ? "Sitemizde reklam alanları veya diğer sitelere bağlantılar bulunabilir. Bu sitelerin gizlilik politikalarından AuraConvert sorumlu değildir."
              : "Our site may contain ad slots or links to other websites. AuraConvert is not responsible for the privacy policies of these external sites."}
          </p>
        </section>
      </div>
    </div>
  );
}
