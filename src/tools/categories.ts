import type { ToolCategory } from "@/tools/types";

export const toolCategories: readonly ToolCategory[] = [
  { id: "text", icon: "text" },
  { id: "math", icon: "calculator" },
  { id: "pdf", icon: "pdf" },
  { id: "image", icon: "image" },
  { id: "video", icon: "video" },
  { id: "audio", icon: "audio" },
  { id: "developer", icon: "developer" },
  { id: "internet", icon: "internet" },
  { id: "files", icon: "files" },
  { id: "games", icon: "games" },
] as const;

export function getCategoryById(id: string): ToolCategory | undefined {
  return toolCategories.find((category) => category.id === id);
}
