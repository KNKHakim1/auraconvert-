"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";
import { cn } from "@/lib/cn";

const THEMES = [
  { id: "light", icon: "sun" },
  { id: "dark", icon: "moon" },
  { id: "midnight", icon: "moon" },
  { id: "amoled", icon: "moon" },
  { id: "dim", icon: "moon" },
  { id: "stone", icon: "moon" },
  { id: "dracula", icon: "moon" },
  { id: "nord", icon: "moon" },
  { id: "ocean", icon: "moon" },
  { id: "monochrome", icon: "moon" },
] as const;

export function ThemePage() {
  const { t } = useTranslations();
  const [activeTheme, setActiveTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("auraconvert-theme") || "light";
    setActiveTheme(stored);
  }, []);

  function handleThemeChange(newTheme: string) {
    setActiveTheme(newTheme);
    window.localStorage.setItem("auraconvert-theme", newTheme);
    
    if (newTheme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  }

  if (!mounted) {
    return <div className="h-screen animate-pulse bg-background" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 py-8 pb-20 animate-fade-in">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Icon name="palette" className="w-8 h-8 text-primary-500" />
          {t("themes.title")}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t("themes.subtitle")}</p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={cn(
                "group relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl border glass bg-card/40 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10",
                isActive 
                  ? "border-primary-500 ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/10" 
                  : "border-border hover:border-primary-500/30"
              )}
            >
              {/* Theme Preview Mini Window - Uses semantic classes that adapt to data-theme */}
              <div 
                className="w-full h-36 rounded-2xl border border-border overflow-hidden shadow-inner"
                data-theme={theme.id === "light" ? undefined : theme.id}
              >
                <div className="h-full w-full bg-background flex flex-col">
                  {/* Fake Navbar */}
                  <div className="h-10 w-full bg-card/80 border-b border-border flex items-center px-4 gap-3 backdrop-blur-md">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm" />
                    <div className="h-2.5 w-16 rounded-full bg-muted-foreground/30" />
                    <div className="ml-auto h-2.5 w-8 rounded-full bg-muted-foreground/20" />
                  </div>
                  {/* Fake Content */}
                  <div className="flex-1 p-5 space-y-4">
                    <div className="h-5 w-3/4 rounded-full bg-foreground/90" />
                    <div className="h-3 w-1/2 rounded-full bg-muted-foreground/50" />
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="h-14 w-full rounded-xl border border-border bg-card shadow-sm" />
                      <div className="h-14 w-full rounded-xl border border-border bg-card shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="w-full flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t(`themes.${theme.id}.name`)}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {t(`themes.${theme.id}.desc`)}
                  </p>
                </div>
                {isActive ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow-md shadow-primary-500/30">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-transparent group-hover:border-primary-500/30 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
