"use client";

import dynamic from "next/dynamic";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";
import { getAllTools, getToolBySlug } from "@/tools/registry";

const toolLoading = () => (
  <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
);

const lazyTools = Object.fromEntries(
  getAllTools().map((tool) => [tool.id, dynamic(tool.load, { loading: toolLoading })]),
);

export function ToolWorkspace({ slug }: { slug: string }) {
  const { t } = useTranslations();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return null;
  }

  const ToolComponent = lazyTools[tool.id];

  if (!ToolComponent) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs font-medium text-muted-foreground gap-2">
        <a href="/" className="hover:text-primary transition-colors">{t("nav.home")}</a>
        <span>/</span>
        <a href="/tools" className="hover:text-primary transition-colors">{t("nav.tools")}</a>
        <span>/</span>
        <span className="text-foreground">{t(`categories.${tool.categoryId}.name`)}</span>
      </nav>

      <header className="space-y-4">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20 shadow-sm">
            <Icon name={tool.icon} />
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t(`tools.${tool.id}.name`)}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{t(`tools.${tool.id}.description`)}</p>
          </div>
        </div>
      </header>

      <AdPlaceholder slot="tool" />
      
      <div className="rounded-[1.6rem] border border-border bg-card/60 glass p-5 sm:p-6 shadow-sm">
        <ToolComponent />
      </div>

      {/* SEO Article Section */}
      <article className="mt-16 pt-8 border-t border-border space-y-6 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {t(`tools.${tool.id}.name`)} Nedir ve Nasıl Kullanılır?
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p>
            <strong>{t(`tools.${tool.id}.name`)}</strong>, {t(`tools.${tool.id}.description`).toLowerCase()} Bu araç, {t(`categories.${tool.categoryId}.name`).toLowerCase()} işlemlerinizi tamamen tarayıcı üzerinde, sunucuya veri göndermeden (client-side) güvenli bir şekilde gerçekleştirmenizi sağlar.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">Nasıl Çalışır?</h3>
          <p>
            Araç arayüzünü kullanarak giriş verilerinizi sağladığınızda, işlemler doğrudan cihazınızın işlemcisi (CPU) kullanılarak gerçekleştirilir. Bu durum, veri gizliliğini maksimum seviyede tutarken aynı zamanda bekleme süresini (gecikmeyi) sıfıra indirir.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">Sık Sorulan Sorular</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Verilerim nerede işleniyor?</strong> Tüm veriler sadece sizin tarayıcınızda (lokal olarak) işlenir. Hiçbir veri sunucularımıza yüklenmez veya kaydedilmez.</li>
            <li><strong>Bu araç ücretsiz mi?</strong> Evet, AuraConvert üzerindeki tüm araçlar gibi bu araç da %100 ücretsizdir.</li>
            <li><strong>Mobil cihazlarda çalışır mı?</strong> Kesinlikle! AuraConvert tamamen responsive (mobil uyumlu) bir tasarıma sahiptir ve her boyuttaki ekranda sorunsuz çalışır.</li>
          </ul>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">İlgili Araçlar</h3>
          <ul className="flex flex-col gap-2 mt-4 text-primary font-medium">
            {getAllTools()
              .filter(t => t.categoryId === tool.categoryId && t.id !== tool.id)
              .slice(0, 4)
              .map(relatedTool => (
                <li key={relatedTool.id}>
                  <a href={`/tools/${relatedTool.slug}`} className="hover:underline flex items-center gap-2">
                    <Icon name={relatedTool.icon} className="w-4 h-4" />
                    {t(`tools.${relatedTool.id}.name`)}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
