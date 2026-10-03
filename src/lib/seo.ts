import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getMessages, translate } from "@/i18n/dictionary";
import type { ToolDefinition } from "@/tools/types";

export function getSiteUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

export function buildCanonical(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function buildToolMetadata(tool: ToolDefinition, locale: Locale): Metadata {
  const seo = tool.seo[locale];
  const messages = getMessages(locale);
  const siteName = translate(messages, "meta.siteName");
  const title = seo.title.includes(siteName) ? seo.title : `${seo.title} — ${siteName}`;
  const url = buildCanonical(`/tools/${tool.slug}`);
  const alternateLanguages = Object.fromEntries(
    tool.supportedLocales.map((item) => [item, url]),
  );

  return {
    title: {
      absolute: title,
    },
    description: seo.description,
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description: seo.description,
      siteName,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
    },
  };
}

export function buildToolJsonLd(tool: ToolDefinition, locale: Locale) {
  const seo = tool.seo[locale];
  const messages = getMessages(locale);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.title,
    description: seo.description,
    url: buildCanonical(`/tools/${tool.slug}`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: translate(messages, "meta.siteName"),
      url: getSiteUrl(),
    },
  };
}
