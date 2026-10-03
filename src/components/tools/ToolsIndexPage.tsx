"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CategorySection } from "@/components/tools/CategorySection";
import { ToolCard } from "@/components/tools/ToolCard";
import { useTranslations } from "@/i18n/use-translations";
import { cn } from "@/lib/cn";
import { getCategoryById, toolCategories } from "@/tools/categories";
import { getAllTools, getToolsByCategory } from "@/tools/registry";

export function ToolsIndexPage() {
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const selected = categoryId ? getCategoryById(categoryId) : undefined;
  const tools = useMemo(
    () => (selected ? getToolsByCategory(selected.id) : getAllTools()),
    [selected],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {t("toolsPage.title")}
        </h1>
        <p className="max-w-2xl text-zinc-600">{t("toolsPage.subtitle")}</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/tools" active={!selected} label={t("toolsPage.filterAll")} />
          {toolCategories.map((category) => (
            <FilterChip
              key={category.id}
              href={`/tools?category=${category.id}`}
              active={selected?.id === category.id}
              label={t(`categories.${category.id}.name`)}
            />
          ))}
        </div>
      </header>

      {selected ? (
        <CategorySection category={selected} tools={tools} />
      ) : tools.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("toolsPage.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm transition",
        active
          ? "bg-primary-100 text-primary-700"
          : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
      )}
    >
      {label}
    </Link>
  );
}
