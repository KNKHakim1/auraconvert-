import type { Locale } from "@/i18n/config";
import en from "@/i18n/locales/en.json";
import tr from "@/i18n/locales/tr.json";

export type Messages = typeof tr;

const dictionaries: Record<Locale, Messages> = {
  tr,
  en: en as Messages,
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function translate(
  messages: Messages,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);

  if (typeof value !== "string") {
    return key;
  }

  if (!vars) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (_, name: string) => {
    const replacement = vars[name];
    return replacement === undefined ? `{${name}}` : String(replacement);
  });
}
