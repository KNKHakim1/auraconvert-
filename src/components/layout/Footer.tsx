"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/use-translations";
import { Icon } from "@/components/icons/Icon";

export function Footer() {
  const { t } = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/50 bg-background/50 backdrop-blur-lg">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition-transform group-hover:scale-105">
                T
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">AuraConvert</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">AuraConvert</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Yasal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {year} AuraConvert. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <a href="mailto:merhaba@AuraConvert.com" className="hover:text-foreground transition-colors flex items-center gap-1.5" aria-label="Email">
              <Icon name="mail" className="w-5 h-5" />
              <span>merhaba@AuraConvert.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
