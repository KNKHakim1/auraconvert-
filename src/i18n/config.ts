export const LOCALES = ["tr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_COOKIE = "auraconvert-locale";

export const LOCALE_STORAGE_KEY = "auraconvert-locale";

export const localeLabels: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "tr" || value === "en";
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function detectBrowserLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const candidates = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((part): part is string => Boolean(part));

  for (const item of candidates) {
    if (item === "tr" || item.startsWith("tr-")) return "tr";
    if (item === "en" || item.startsWith("en-")) return "en";
  }

  return DEFAULT_LOCALE;
}

const RTL_LOCALES: readonly string[] = [];

export function getDocumentDirection(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
