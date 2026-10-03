import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionary";
import { translate } from "@/i18n/dictionary";
import { getAllTools } from "@/tools/registry";
import type { ToolDefinition } from "@/tools/types";

export function searchTools(
  query: string,
  locale: Locale,
  messages: Messages,
): readonly ToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  const tools = getAllTools();

  if (!normalized) {
    return tools;
  }

  return tools.filter((tool) => {
    const name = translate(messages, `tools.${tool.id}.name`).toLowerCase();
    const description = translate(messages, `tools.${tool.id}.description`).toLowerCase();
    const category = translate(messages, `categories.${tool.categoryId}.name`).toLowerCase();
    const haystack = [
      name,
      description,
      category,
      tool.slug,
      tool.id,
      ...tool.keywords,
      tool.seo[locale].title,
      tool.seo[locale].description,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
