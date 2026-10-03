"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";
import { cn } from "@/lib/cn";
import { toolCategories } from "@/tools/categories";
import { getToolsByCategory } from "@/tools/registry";

const primaryLinks = [
  { href: "/", icon: "home", labelKey: "nav.home" },
  { href: "/tools", icon: "tools", labelKey: "nav.tools" },
  { href: "/themes", icon: "palette", labelKey: "nav.themes" },
] as const;

export function Sidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <div className="flex h-full flex-col bg-white">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 py-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-500 text-sm font-bold text-white shadow-md shadow-primary-500/20">
          T
        </span>
        {!collapsed ? (
          <span className="text-lg font-semibold tracking-tight text-zinc-900">AuraConvert</span>
        ) : null}
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {primaryLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon name={link.icon} />
                {!collapsed ? t(link.labelKey) : <span className="sr-only">{t(link.labelKey)}</span>}
              </Link>
            );
          })}
        </div>

        <div>
          {!collapsed ? (
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              {t("nav.categories")}
            </p>
          ) : null}
          <div className="space-y-1">
            {toolCategories.map((category) => {
              const href = `/tools?category=${category.id}`;
              const count = getToolsByCategory(category.id).length;
              const active = pathname === "/tools";
              return (
                <Link
                  key={category.id}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900",
                    collapsed && "justify-center px-2",
                    active && "bg-zinc-50",
                  )}
                >
                  <Icon name={category.icon} />
                  {!collapsed ? (
                    <span className="flex flex-1 items-center justify-between">
                      <span>{t(`categories.${category.id}.name`)}</span>
                      <span className="text-xs text-zinc-400">{count}</span>
                    </span>
                  ) : (
                    <span className="sr-only">{t(`categories.${category.id}.name`)}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {!collapsed ? <AdPlaceholder slot="sidebar" className="mx-3 mb-4" /> : null}
    </div>
  );
}
