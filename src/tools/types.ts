import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

export type ToolRuntime = "client" | "server";

export type ComputeTarget = "main" | "worker" | "wasm" | "server";

export type ToolSeo = {
  title: string;
  description: string;
};

export type ToolDefinition = {
  id: string;
  slug: string;
  categoryId: string;
  icon: string;
  keywords: readonly string[];
  supportedLocales: readonly Locale[];
  runtime: ToolRuntime;
  computeTarget: ComputeTarget;
  popular?: boolean;
  featured?: boolean;
  addedAt: string;
  seo: Record<Locale, ToolSeo>;
  load: () => Promise<{ default: ComponentType }>;
};

export type ToolCategory = {
  id: string;
  icon: string;
};
