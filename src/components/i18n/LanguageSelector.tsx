"use client";

import { LOCALES, localeLabels, type Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/use-translations";

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslations();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="appearance-none rounded-xl border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm font-medium text-zinc-900 outline-none transition hover:bg-zinc-50 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 shadow-sm cursor-pointer"
      >
        {LOCALES.map((item) => (
          <option key={item} value={item} className="text-zinc-900">
            {localeLabels[item]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 text-zinc-500">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)" />
        </svg>
      </div>
    </label>
  );
}
