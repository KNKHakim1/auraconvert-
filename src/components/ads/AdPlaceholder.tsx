"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useTranslations } from "@/i18n/use-translations";

type AdSlot = "sidebar" | "homepage" | "tool";

// Eğer kullanıcı kendi slot ID'lerini .env üzerinden eklerse burayı kullanacağız
// Şimdilik test ve hazırlık aşaması için boş
const AD_SLOTS: Record<AdSlot, string> = {
  homepage: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE || "4699812779",
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || "4699812779",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "4699812779",
};

export function AdPlaceholder({
  slot,
  className,
}: {
  slot: AdSlot;
  className?: string;
}) {
  const { t } = useTranslations();
  const adSlotId = AD_SLOTS[slot];
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Sadece slot ID varsa ve daha önce yüklenmediyse reklamı başlat
    if (adSlotId && adRef.current && !isLoaded.current) {
      try {
        isLoaded.current = true;
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error", err);
      }
    }
  }, [adSlotId]);

  if (!adSlotId) {
    // Reklam ID'si girilmemişse eski "Placeholder" görünümünü göster
    return (
      <aside
        aria-label={t("ads.label")}
        className={cn(
          "rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center dark:bg-zinc-900/50 dark:border-zinc-800",
          className,
        )}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">
          {t("ads.label")}
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("ads.note")}</p>
      </aside>
    );
  }

  // Reklam ID'si varsa gerçek AdSense reklamını göster
  return (
    <aside
      aria-label="Advertisement"
      className={cn("w-full overflow-hidden flex justify-center", className)}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-7021435850368818"
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
