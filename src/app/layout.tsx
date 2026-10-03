import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_LOCALE,
  getDocumentDirection,
  LOCALE_COOKIE,
  resolveLocale,
} from "@/i18n/config";
import { getMessages, translate } from "@/i18n/dictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: translate(messages, "meta.defaultTitle"),
      template: `%s — ${translate(messages, "meta.siteName")}`,
    },
    description: translate(messages, "meta.defaultDescription"),
    openGraph: {
      type: "website",
      siteName: translate(messages, "meta.siteName"),
      title: translate(messages, "meta.defaultTitle"),
      description: translate(messages, "meta.defaultDescription"),
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: translate(messages, "meta.defaultTitle"),
      description: translate(messages, "meta.defaultDescription"),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE,
  );

  return (
    <html
      lang={locale}
      dir={getDocumentDirection(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7021435850368818" 
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full">
        <I18nProvider initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
