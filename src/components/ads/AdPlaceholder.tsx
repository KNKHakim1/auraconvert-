"use client";

import { cn } from "@/lib/cn";
import { useTranslations } from "@/i18n/use-translations";

type AdSlot = "sidebar" | "homepage" | "tool";

export function AdPlaceholder({
  slot,
  className,
}: {
  slot: AdSlot;
  className?: string;
}) {
  const { t } = useTranslations();

  return (
    <aside
      aria-label={t("ads.label")}
      data-ad-slot={slot}
      className={cn(
        "rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center",
        className,
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
        {t("ads.label")}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{t("ads.note")}</p>
    </aside>
  );
}
