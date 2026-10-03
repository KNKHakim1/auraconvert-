"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { useTranslations } from "@/i18n/use-translations";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

const primaryLinks = [
  { href: "/tools", icon: "tools", labelKey: "nav.tools" },
  { href: "/themes", icon: "palette", labelKey: "nav.themes" },
] as const;

export function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Modern scroll effect for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 pt-4 px-4 transition-all duration-300",
        scrolled ? "pt-2" : "pt-4 sm:pt-6"
      )}
    >
      <div 
        className={cn(
          "mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-2.5 transition-all duration-500 glass",
          scrolled 
            ? "rounded-full shadow-lg shadow-black/5 dark:shadow-black/20 bg-card/60" 
            : "rounded-2xl shadow-sm bg-card/40"
        )}
      >
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full border border-border bg-background/50 p-2 text-foreground lg:hidden hover:bg-muted transition"
          aria-label={t("nav.openMenu")}
        >
          <Icon name="menu" />
        </button>

        {/* Logo (Desktop) */}
        <Link
          href="/"
          className="hidden items-center gap-2 lg:flex shrink-0 mr-4 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition-transform group-hover:scale-105 group-hover:shadow-primary-500/40">
            T
          </span>
          <span className="text-base font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">AuraConvert</span>
        </Link>
        
        {/* Primary Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {primaryLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 flex justify-center lg:justify-end max-w-lg ml-auto">
          <GlobalSearch />
        </div>

        {/* Settings/Language */}
        <div className="flex items-center shrink-0 ml-1 pl-3 border-l border-border/50">
          <LanguageSelector />
        </div>

      </div>
    </header>
  );
}
