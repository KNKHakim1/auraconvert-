"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";
import { searchTools } from "@/lib/search";
import { cn } from "@/lib/cn";

export function GlobalSearch({
  variant = "navbar",
}: {
  variant?: "navbar" | "hero";
}) {
  const { t, locale, messages } = useTranslations();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => searchTools(query, locale, messages),
    [query, locale, messages],
  );

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const placeholder =
    variant === "hero" ? t("home.searchPlaceholder") : t("nav.searchPlaceholder");

  return (
    <div ref={rootRef} className={cn("relative w-full group", variant === "navbar" && "max-w-xl")}>
      <label className="relative block">
        <span className="sr-only">{t("nav.searchAria")}</span>
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary-500 transition-colors">
          <Icon name="search" />
        </span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-full border border-border bg-input/50 glass pl-12 pr-6 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 focus:bg-card hover:bg-input/80",
            variant === "hero" ? "h-16 text-lg shadow-xl shadow-primary-500/5" : "h-11 text-sm shadow-sm",
          )}
        />
      </label>

      {open && query.trim() ? (
        <div
          role="listbox"
          className="absolute z-50 mt-3 w-full overflow-hidden rounded-3xl border border-border bg-popover/80 shadow-2xl glass backdrop-blur-2xl animate-fade-in"
        >
          {results.length === 0 ? (
            <p className="px-6 py-5 text-sm text-muted-foreground text-center">{t("nav.noResults")}</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto p-2">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  role="option"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-start gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 hover:bg-muted/80"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    <Icon name={tool.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {t(`tools.${tool.id}.name`)}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground line-clamp-1">
                      {t(`tools.${tool.id}.description`)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
