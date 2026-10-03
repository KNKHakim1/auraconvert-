"use client";

import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { ToolCard } from "@/components/tools/ToolCard";
import { useTranslations } from "@/i18n/use-translations";
import type { ToolCategory } from "@/tools/types";
import type { ToolDefinition } from "@/tools/types";

export function CategorySection({
  category,
  tools,
}: {
  category: ToolCategory;
  tools: readonly ToolDefinition[];
}) {
  const { t } = useTranslations();

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <Icon name={category.icon} className="h-5 w-5" />
            </span>
            {t(`categories.${category.id}.name`)}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground ml-13">
            {t(`categories.${category.id}.description`)}
          </p>
        </div>
        <Link
          href={`/tools?category=${category.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 transition hover:opacity-80 px-3 py-1.5 rounded-full hover:bg-primary-500/10"
        >
          {t("home.browseAll")}
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </Link>
      </div>
      {tools.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          {t("home.emptyCategory")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
