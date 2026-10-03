"use client";

import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";
import { cn } from "@/lib/cn";
import type { ToolDefinition } from "@/tools/types";

export function ToolCard({
  tool,
  className,
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  const { t } = useTranslations();

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-card/40 glass p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30",
        className,
      )}
    >
      {/* Ambient hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="flex items-start justify-between relative">
        <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-500">
          <Icon name={tool.icon} className="h-6 w-6" />
        </span>
        
        {/* Category tag moved to top right for better balance */}
        <span className="inline-flex items-center rounded-full bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {t(`categories.${tool.categoryId}.name`)}
        </span>
      </div>
      
      <div className="relative mt-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {t(`tools.${tool.id}.name`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {t(`tools.${tool.id}.description`)}
        </p>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-4">
        <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          Aracı Kullan
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
